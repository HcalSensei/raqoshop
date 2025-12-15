import multer from 'multer';
import path from 'path';

export class ImageUploader {
  private static readonly storage = multer.diskStorage({
    destination: function (req: any, file : any, cb: any) {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req: any, file: any, cb: any) {
      const ext = file.mimetype.split('/')[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  private static readonly upload = multer({ storage: ImageUploader.storage });

  static uploadSingle = ImageUploader.upload.single('image');
}
