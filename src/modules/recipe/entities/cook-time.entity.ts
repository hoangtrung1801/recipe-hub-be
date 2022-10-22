import { Allow, IsInt } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class CookTime {
    @PrimaryGeneratedColumn('uuid')
    @Allow()
    id: string;

    @Column({
        type: 'int',
    })
    @IsInt()
    total: number;

    @Column({
        type: 'int',
    })
    @IsInt()
    prep: number;

    @Column({
        type: 'int',
    })
    @IsInt()
    chill: number;

    @Column({
        type: 'int',
    })
    @IsInt()
    cook: number;
}
