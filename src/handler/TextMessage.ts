import {Settings} from '../settings/Settings';
import {IssueIterator} from './IssueIterator';

export class TextMessage {

    private readonly settings: Settings;
    private readonly text: string;

    constructor(settings: Settings, text: string) {
        this.text = text;
        this.settings = settings;
    }

    public async hasIssues(): Promise<boolean> {
        return !this.issueIterator().next().done;
    }

    public async linkIssues(): Promise<string> {
        let text = this.text;
        let offset = 0;

        for (const issue of this.issueIterator()) {
            const lengthBeforeReplacing = text.length;
            const issueIndex = issue!.index;
            const issueText = issue!.text;
            text = textBefore(issueIndex)
                + this.markdownIssueLink(issueText)
                + textAfter(issueIndex + issueText.length);
            offset += text.length - lengthBeforeReplacing;
        }
        return text;

        function textBefore(index) {
            return text.substr(0, offset + index);
        }

        function textAfter(index) {
            return text.substr(offset + index);
        }
    }

    private issueIterator() {
        return new IssueIterator(this.text, this.settings.issuePattern, Settings.EXCLUDE_PATTERNS);
    }

    private markdownIssueLink(issueText) {
        return `[${issueText}](${this.settings.baseUrl}/issue/${issueText})`;
    }
}
