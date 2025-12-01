import { diskStorage } from 'multer';
import { extname } from 'path';

export class UploadMiddleware {
  static getMulterOptions() {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(
            new Error('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)'),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB (aumentado para S3)
      },
    };
  }
}
