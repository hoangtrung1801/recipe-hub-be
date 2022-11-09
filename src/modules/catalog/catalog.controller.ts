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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
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
@ApiTags('Catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all catalogs' })
    findAll() {
        return this.catalogService.findAll();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get specific catalog by id' })
    findOne(@Param('id') id: string) {
        return this.catalogService.findOne(id);
    }

    @Post()
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Create catalog' })
    create(@Body() catalog: Catalog) {
        return this.catalogService.create(catalog);
    }

    @Post('/:id/recipes')
    @ApiOperation({ summary: 'Add recipes to catalog' })
    addRecipesTo(
        @Body() addRecipesToDto: AddRecipesToDto,
        @Param('id') id: string,
    ) {
        return this.catalogService.addRecipesTo(id, addRecipesToDto);
    }
}
