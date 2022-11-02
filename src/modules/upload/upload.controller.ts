import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import File from './entities/file.entity';
import { FileUploadDto } from './request/file-upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('image')
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload image' })
    @ApiBody({
        type: FileUploadDto,
        description:
            "Don't need type, contentUrl attributes, and name attribute is optional",
    })
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({
        type: File,
    })
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() fileInfo: File,
    ) {
        return this.uploadService.uploadImage(file, fileInfo);
    }
}
