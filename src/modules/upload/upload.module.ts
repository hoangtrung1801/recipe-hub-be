import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import File from './entities/file.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
