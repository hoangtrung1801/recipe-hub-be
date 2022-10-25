import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export default abstract class AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    @Allow()
    @Expose()
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        update: false,
        nullable: false,
    })
    @Allow()
    @Type(() => Date)
    @Expose()
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        nullable: false,
    })
    @Allow()
    @Type(() => Date)
    @Expose()
    updatedAt: Date;
}
