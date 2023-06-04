import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { DTObject, ParseError } from 'dto-classes';


@Injectable()
export class DTOValidationPipe implements PipeTransform {

    async transform(value: any, metadata: ArgumentMetadata) {
        let DTOClass: typeof DTObject = null;

        if (metadata.metatype.prototype instanceof DTObject) {
            DTOClass = metadata.metatype as any;
        }

        if (!DTOClass) {
            return value;
        }

        try {
            value = await DTOClass.parse(value);
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