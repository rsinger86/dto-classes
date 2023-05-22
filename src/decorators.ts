

export interface ValidateMethodOptions {
    receiveEmpty?: boolean;
    receieveNull?: boolean;
}

export const AfterParse = (options: ValidateMethodOptions = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName]['__isPostParser'] = true;
        target[memberName]['__PostParserOptions'] = options ?? {};
        return target;
    }
}

export const BeforeParse = (options: { receiveEmpty?: boolean } = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName]['__isPreparser'] = true;
        return target;
    }
}