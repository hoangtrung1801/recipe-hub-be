import { config } from 'dotenv';

config();

export default {
    secretKey: process.env.SECRET_KEY,
};
