import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeModule } from '../recipe/recipe.module';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import Catalog from './entities/catalog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Catalog]), RecipeModule],
    controllers: [CatalogController],
    providers: [CatalogService],
    exports: [],
})
export class CatalogModule {}
