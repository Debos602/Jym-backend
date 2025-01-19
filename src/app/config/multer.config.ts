import { CloudinaryStorage, Options } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config'; // Assuming you have a proper config here
import multer from 'multer';

// Extend Options to include folder and allowedFormats
interface CloudinaryParams extends Options {
  folder: string; // This is now required
  allowedFormats: string[];
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload, // This is mandatory
  params: {
    folder: 'car-images', // specify the folder name in Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg'], // specify allowed file formats
  } as CloudinaryParams, // Cast to your custom type
});

export const multerUpload = multer({ storage });
