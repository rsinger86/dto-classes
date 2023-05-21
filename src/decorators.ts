

export interface ValidateMethodOptions {
    receiveEmpty?: boolean;
    receieveNull?: boolean;
}

export const validate = (options: ValidateMethodOptions = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName]['__isValidator'] = true;
        target[memberName]['__ValidatorOptions'] = options ?? {};
        return target;
    }
}

export const preparse = (options: { receiveEmpty?: boolean } = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName]['__isPreparser'] = true;
        return target;
    }
}