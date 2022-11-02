import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, IsString } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import FileType from 'src/common/enums/file-type.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export default class File extends AbstractEntity {
    @Column()
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    name: string;

    @Column({
        type: 'enum',
        enum: FileType,
    })
    @Allow()
    @ApiProperty({ required: false })
    type: FileType;

    @Column()
    @Allow()
    @ApiProperty({ required: false })
    contentUrl: string;

    constructor(partial: Partial<File>) {
        super();
        Object.assign(this, partial);
    }
}
