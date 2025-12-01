import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // Usar variables de entorno directamente
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Faltan variables de entorno para AWS S3');
    }

    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    this.bucketName = bucketName;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'evidencias',
  ): Promise<string> {
    try {
      // Generar un nombre único para el archivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      // Limpiar el nombre del archivo de caracteres especiales
      const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const key = `${folder}/${timestamp}-${randomString}-${cleanFileName}`;

      // Convertir buffer a stream si es necesario
      let body: Buffer | Readable;
      if (file.buffer) {
        body = file.buffer;
      } else if (file.stream) {
        body = file.stream;
      } else {
        // Si no hay buffer ni stream, crear un Readable desde el path
        const fs = require('fs');
        body = fs.createReadStream(file.path);
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: file.mimetype,
        // ❌ NO incluir ACL - el bucket debe tener política pública configurada
      });

      await this.s3Client.send(command);

      // Retornar la URL pública del archivo
      // Asumiendo que el bucket está configurado para acceso público
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error(`No se pudo subir el archivo a S3: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extraer la key de la URL
      const key = fileUrl.replace(
        `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
        '',
      );

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      console.log(`Archivo eliminado de S3: ${key}`);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }

  // Método para verificar si una URL es de S3
  isS3Url(url: string): boolean {
    return url.includes('s3.amazonaws.com');
  }
}
