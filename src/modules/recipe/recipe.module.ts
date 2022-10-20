import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Recipe from './entities/recipe.entity';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe])],
    controllers: [RecipeController],
    providers: [RecipeService],
    exports: [TypeOrmModule, RecipeService],
})
export class RecipeModule {}
