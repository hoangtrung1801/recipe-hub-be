import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiGlobalResponse<T extends Type | [Type]>(options: {
    type: T;
    description?: string;
}) {
    return applyDecorators(
        // ApiExtraModels(ResponseDto, model),
        // ApiOkResponse({
        //     schema: {
        //         allOf: [
        //             { $ref: getSchemaPath(ResponseDto) },
        //             {
        //                 properties: {
        //                     payload: {
        //                         $ref: getSchemaPath(model),
        //                     },
        //                     timestamp: {
        //                         type: 'number',
        //                     },
        //                 },
        //             },
        //         ],
        //     },
        // }),
        ApiOkResponse({
            type: options.type,
            description: options.description || 'Successfull',
        }),
        ApiUnauthorizedResponse({ description: 'Not authenticated' }),
        ApiForbiddenResponse({ description: 'Access denied' }),
        ApiNotFoundResponse({ description: 'Not found' }),
        ApiInternalServerErrorResponse({ description: 'Server error' }),
    );
}
