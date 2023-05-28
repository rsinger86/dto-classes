

export interface ValidateMethodOptions {
    receieveNull?: boolean;
}

export const AfterParse = (options: ValidateMethodOptions = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName]['__isPostParser'] = true;
        target[memberName]['__PostParserOptions'] = options ?? {};
        return target;
    }
}

export const BeforeParse = (options: {} = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName]['__isPreparser'] = true;
        return target;
    }
}


export const Format = (options: { fieldName?: string } = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        if (!options.fieldName) {
            options.fieldName = target[memberName].name.replace(/^get/, '')
        }

        target[memberName]['__isFormatter'] = true;
        target[memberName]['__FormatterOptions'] = options;
        return target;
    }
}