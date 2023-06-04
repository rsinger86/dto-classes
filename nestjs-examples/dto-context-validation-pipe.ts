import {
    ArgumentMetadata,
    BadRequestException,
    Inject,
    Injectable,
    PipeTransform,
    Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DTObject, ParseError } from 'dto-classes';
import { Request } from 'express'


@Injectable({ scope: Scope.REQUEST })
export class DTOContextValidationPipe implements PipeTransform {

    constructor(@Inject(REQUEST) protected readonly request: Request) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        let DTOClass: typeof DTObject = null;

        if (metadata.metatype.prototype instanceof DTObject) {
            DTOClass = metadata.metatype as any;
        }

        if (!DTOClass) {
            return value;
        }

        try {
            value = await DTOClass.parse(value, { context: { request: this.request } });
        } catch (e) {
            if (e instanceof ParseError) {
                throw new BadRequestException({
                    message: 'Validation failed.',
                    error: e.issues.map(x => {
                        return { message: x.message, path: x.path }
                    })
                });
            }
        }

        return value;
    }
}