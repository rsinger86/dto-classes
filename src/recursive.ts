import { BaseField, BaseFieldOptions } from "./fields/base-field";


export class Deferred<T extends typeof BaseField> {
    private fieldClass: typeof BaseField
    private options: BaseFieldOptions;

    constructor(fieldClass: typeof BaseField, options: BaseFieldOptions) {
        this.fieldClass = fieldClass,
            this.options = options;
    }

    public construct(): InstanceType<T> {
        return new this.fieldClass(this.options) as any;
    }

}

export function Recursive<T extends typeof BaseField>(
    field: T,
    options: BaseFieldOptions = {}
): InstanceType<T> {
    return new Deferred(field, options) as any;
}
