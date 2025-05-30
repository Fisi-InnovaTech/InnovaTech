import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadMiddleware {
  static getMulterOptions(): MulterOptions {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = randomBytes(16).toString('hex');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!/\.(jpg|jpeg|png|gif)$/i.exec(file.originalname)) {
          return cb(
            new HttpException(
              'Solo se permiten archivos de imagen (jpg, jpeg, png, gif)',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 8000000, 
        files: 1,
        fields: 10,
        fieldNameSize: 100,
        fieldSize: 1024 * 1024,
      },
    };
  }
}