export class ParseIssue {
    public readonly message: string;
    public path: string[] = [];

    constructor(message: string) {
        this.message = message
    }

    public addParentPath(path: string) {
        this.path.unshift(path)
    }
}

// https://github.com/colinhacks/zod/blob/master/src/ZodError.ts