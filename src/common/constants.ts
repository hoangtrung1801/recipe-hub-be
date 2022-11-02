import { config } from 'dotenv';

config();

export default {
    secretKey: process.env.SECRET_KEY,
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryFolderImgs: 'recipe-hub/images',
    cloudinaryFolderFiles: 'recipe-hub/files',
};
