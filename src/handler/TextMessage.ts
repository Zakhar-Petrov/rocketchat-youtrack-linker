import {Settings} from '../settings/Settings';

export class TextMessage {

    private readonly settings: Settings;
    private readonly text: string;

    constructor(settings: Settings, text: string) {
        this.text = text;
        this.settings = settings;
    }

    public async hasIssues(): Promise<boolean> {
        const issueMatcher = this.buildIssueMatcher();
        while (true) {
            const matchedResult = this.matchedResult(issueMatcher);
            if (!matchedResult) {
                return false;
            }
            const issueSubgroup = matchedResult[1];
            if (issueSubgroup) {
                return true;
            }
        }
    }

    public async linkIssues(): Promise<string> {
        const issueMatcher = this.buildIssueMatcher();
        let result = this.text;
        let offset = 0;
        while (true) {
            const matchedResult = this.matchedResult(issueMatcher);
            if (!matchedResult) {
                break;
            }
            const issueSubgroup = matchedResult[1];
            if (!issueSubgroup) {
                continue;
            }
            const lengthBeforeReplacing = result.length;
            result = result.substr(0, offset + matchedResult.index)
                + `[${issueSubgroup}](${this.settings.baseUrl}/issue/${issueSubgroup})`
                + result.substr(offset + matchedResult.index + matchedResult[1].length);
            offset += result.length - lengthBeforeReplacing;
        }
        return result;
    }

    private buildIssueMatcher() {
        return new RegExp(`${Settings.EXCLUDE_PATTERNS}|(${this.settings.issuePattern})`, 'g');
    }

    private matchedResult(issueMatcher: RegExp) {
        return issueMatcher.exec(this.text);
    }
}
