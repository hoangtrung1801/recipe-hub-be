import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export default abstract class AbstractEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    @Allow()
    id: string;

    @AutoMap()
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        update: false,
        nullable: false,
    })
    @Allow()
    @Type(() => Date)
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        nullable: false,
    })
    @Allow()
    @Type(() => Date)
    updatedAt: Date;
}
