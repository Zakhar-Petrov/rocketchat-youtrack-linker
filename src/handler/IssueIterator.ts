export class IssueIterator {

    private readonly text: string;
    private readonly issueMatcher: RegExp;
    private readonly maxSearchAttempts: number;
    private searchAttemptsCount: number = 0;

    constructor(text, issuePattern, excludePatterns: string = '', maxSearchAttempts = 25) {
        this.text = text;
        const pattern = (excludePatterns && excludePatterns.length > 0 ? excludePatterns + '|' : '')
            + `(${issuePattern})`;
        this.issueMatcher = new RegExp(pattern, 'g');
        this.maxSearchAttempts = maxSearchAttempts;
    }

    public [Symbol.iterator]() {
        return this;
    }

    public next() {
        while (this.searchAttemptsCount++ < this.maxSearchAttempts) {
            const matchResult = this.issueMatcher.exec(this.text);
            if (!matchResult) {
                break;
            }

            const issueSubgroup = matchResult[1];
            if (issueSubgroup) {
                return {value: {text: issueSubgroup, index: matchResult.index}, done: false};
            }
        }
        return {value: undefined, done: true};
    }
}
