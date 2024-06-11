import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';

export const multerConfig: MulterModuleOptions = {
  dest: resolve(__dirname, '..', '..', 'public'),
  storage: diskStorage({
    destination: resolve(__dirname, '..', '..', 'public'),
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};