import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import constants from 'src/common/constants';
import FileType from 'src/common/enums/file-type.enum';
import cloudinary from 'src/libs/cloudinary';
import { Repository } from 'typeorm';
import File from './entities/file.entity';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async uploadImage(file: Express.Multer.File, fileInfo: File) {
        const base64Image = `data:image/jpg;base64,${file.buffer.toString(
            'base64',
        )}`;

        const fileResponse = await cloudinary.uploader.upload(base64Image, {
            folder: constants.cloudinaryFolderImgs,
        });

        const image = await this.fileRepository.save({
            name: fileInfo.name || fileResponse.original_filename,
            type: FileType.IMG,
            contentUrl: fileResponse.url,
        });

        return image;
    }
}
