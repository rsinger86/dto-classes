import { ValidationIssue } from "./validation-issue";

export class ValidationError extends Error {
    issues: ValidationIssue[] = [];

    constructor(issues: ValidationIssue[] | string) {
        if (typeof issues === 'string') {
            issues = [new ValidationIssue(issues)]
        }
        super(issues.map(x => x.message).join(' '));
        this.name = "ValidationError";
        this.issues = issues;
    }

    addParentPath(path: string) {
        for (const issue of this.issues) {
            issue.addParentPath(path);
        }
    }

    public static combine(errors: ValidationError[]) {
        let allIssues: ValidationIssue[] = [];

        for (const error of errors) {
            for (const issue of error.issues) {
                allIssues.push(issue);
            }
        }

        return new ValidationError(allIssues);
    }
}

// https://github.com/colinhacks/zod/blob/master/src/ZodError.ts
