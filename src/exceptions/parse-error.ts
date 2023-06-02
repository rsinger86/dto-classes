import { ParseIssue } from "./parse-issue";

export class ParseError extends Error {
    issues: ParseIssue[] = [];

    constructor(issues: ParseIssue[] | string) {
        if (typeof issues === 'string') {
            issues = [new ParseIssue(issues)]
        }
        super(issues.map(x => x.message).join(' '));
        this.name = "ParseError";
        this.issues = issues;
    }

    addParentPath(path: string) {
        for (const issue of this.issues) {
            issue.addParentPath(path);
        }
    }

    public static combine(errors: ParseError[]) {
        let allIssues: ParseIssue[] = [];

        for (const error of errors) {
            for (const issue of error.issues) {
                allIssues.push(issue);
            }
        }

        return new ParseError(allIssues);
    }
}

// https://github.com/colinhacks/zod/blob/master/src/ZodError.ts
