import { v2 } from 'cloudinary';
import constants from 'src/common/constants';

const cloudinary = v2;
cloudinary.config({
    cloud_name: constants.cloudinaryName,
    api_key: constants.cloudinaryApiKey,
    api_secret: constants.cloudinaryApiSecret,
});

export default cloudinary;
