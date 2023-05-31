export const IS_POST_PARSER_KEY = '__isPostParser';
export const POST_PARSER_OPTIONS_KEY = '__PostParserOptions';
export const IS_PREPARSER_KEY = '__isPreparser';
export const IS_FORMATTER_KEY = '__isFormatter';
export const FORMATTER_OPTIONS_KEY = '__FormatterOptions';


export interface ValidateMethodOptions {
    receieveNull?: boolean;
}

export const AfterParse = (options: ValidateMethodOptions = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName][IS_POST_PARSER_KEY] = true;
        target[memberName][POST_PARSER_OPTIONS_KEY] = options ?? {};
        return target;
    }
}

export const BeforeParse = (options: {} = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        target[memberName][IS_PREPARSER_KEY] = true;
        return target;
    }
}


export const Format = (options: { fieldName?: string } = {}) => {
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
        if (!options.fieldName) {
            options.fieldName = target[memberName].name
        }

        target[memberName][IS_FORMATTER_KEY] = true;
        target[memberName][FORMATTER_OPTIONS_KEY] = options;
        return target;
    }
}