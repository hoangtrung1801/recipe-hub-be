import { ApiProperty } from '@nestjs/swagger';
import File from '../entities/file.entity';

export class FileUploadDto extends File {
    @ApiProperty({
        type: 'string',
        format: 'binary',
    })
    file: any;
}
