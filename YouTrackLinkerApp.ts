import {
    IHttp,
    ILogger,
    IMessageBuilder,
    IPersistence,
    IRead
} from '@rocket.chat/apps-engine/definition/accessors';
import {App} from '@rocket.chat/apps-engine/definition/App';
import {IAppInfo} from '@rocket.chat/apps-engine/definition/metadata';
import {IMessage, IPreMessageSentModify} from '@rocket.chat/apps-engine/definition/messages';

export class YouTrackLinkerApp extends App implements IPreMessageSentModify {

    private matcher: RegExp = /([A-Z]+-[0-9]+)/g;
    private issueLinkPattern = '[$1](https://agisoft-cloud.corp.geoscan.aero/youtrack/issue/$1)';

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async checkPreMessageSentModify(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        if (typeof message.text !== 'string') {
            return false;
        }
        const youTrackIssues = message.text.match(this.matcher);
        return youTrackIssues != null && youTrackIssues.length > 0;
    }

    public async executePreMessageSentModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        if (typeof message.text !== 'string') {
            return message;
        }
        return builder.setText(message.text.replace(this.matcher, this.issueLinkPattern)).getMessage();
    }

}
