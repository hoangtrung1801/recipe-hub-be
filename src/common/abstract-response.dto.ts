import { AutoMap } from '@automapper/classes';

export default abstract class AbstractResponseDto {
    @AutoMap()
    id: string;

    @AutoMap()
    createdAt: Date;

    @AutoMap()
    updatedAt: Date;
}
