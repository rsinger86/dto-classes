import { ValidationIssue } from "./validation-issue";

export class ValidationError extends Error {
    issues: any[] = [];


    constructor(issues: ValidationIssue[]) {
        super(issues.map(x => x.message).join(' '));
        this.name = "ValidationError";
        this.issues = issues;
    }
}

// https://github.com/colinhacks/zod/blob/master/src/ZodError.ts
