import { BaseField, BaseFieldOptions } from "./fields/base-field";


export class DeferredField<T extends typeof BaseField = typeof BaseField> {
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
    return new DeferredField(field, options) as any;
}
