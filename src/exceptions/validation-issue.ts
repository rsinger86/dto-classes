export class ValidationIssue {
    public readonly message: string;

    constructor(message: string) {
        this.message = message
    }
}

// https://github.com/colinhacks/zod/blob/master/src/ZodError.ts