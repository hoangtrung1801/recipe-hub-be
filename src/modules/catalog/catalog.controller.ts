import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import Role from 'src/common/enums/role.enum';
import { CatalogService } from './catalog.service';
import { AddRecipesToDto } from './dto/request/add-recipes-to.dto';
import Catalog from './entities/catalog.entity';

@Controller('catalogs')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    strategy: 'exposeAll',
})
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get()
    findAll() {
        return this.catalogService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.catalogService.findOne(id);
    }

    @Post()
    @Roles(Role.Admin)
    create(@Body() catalog: Catalog) {
        return this.catalogService.create(catalog);
    }

    @Post('/:id/recipes')
    addRecipesTo(
        @Body() addRecipesToDto: AddRecipesToDto,
        @Param('id') id: string,
    ) {
        return this.catalogService.addRecipesTo(id, addRecipesToDto);
    }
}
