export class ValidationError<T = any> extends Error {
    issues: any[] = [];


    constructor(issues: any[]) {
        super();

        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(this, actualProto);
        } else {
            (this as any).__proto__ = actualProto;
        }
        this.name = "ValidationError";
        this.issues = issues;
    }
}

// https://github.com/colinhacks/zod/blob/master/src/ZodError.ts