import {
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IMessageBuilder,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {App} from '@rocket.chat/apps-engine/definition/App';
import {IMessage, IPreMessageSentModify} from '@rocket.chat/apps-engine/definition/messages';
import {IAppInfo} from '@rocket.chat/apps-engine/definition/metadata';
import {ISetting} from '@rocket.chat/apps-engine/definition/settings';
import {Settings} from './src/settings/Settings';

export class YouTrackLinkerApp extends App implements IPreMessageSentModify {

    private readonly settings: Settings = new Settings();

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async checkPreMessageSentModify(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        if (typeof message.text !== 'string') {
            return false;
        }

        const issueMatcher = this.buildIssueMatcher();
        while (true) {
            const matchedResult = issueMatcher.exec(message.text);
            if (!matchedResult) {
                return false;
            }
            const issueSubgroup = matchedResult[1];
            if (issueSubgroup) {
                return true;
            }
        }
    }

    // tslint:disable-next-line:max-line-length
    public async executePreMessageSentModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        if (typeof message.text !== 'string') {
            return message;
        }

        const issueMatcher = this.buildIssueMatcher();
        let text = message.text;
        let offset = 0;
        while (true) {
            const matchedResult = issueMatcher.exec(message.text);
            if (!matchedResult) {
                break;
            }
            const issueSubgroup = matchedResult[1];
            if (!issueSubgroup) {
                continue;
            }
            const lengthBeforeReplacing = text.length;
            text = text.substr(0, offset + matchedResult.index)
                + `[${issueSubgroup}](${this.settings.baseUrl}/issue/${issueSubgroup})`
                + text.substr(offset + matchedResult.index + matchedResult[1].length);
            offset += text.length - lengthBeforeReplacing;
        }
        return builder.setText(text).getMessage();
    }

    public async onEnable(environmentRead: IEnvironmentRead, configModify: IConfigurationModify): Promise<boolean> {
        await this.settings.setFrom(environmentRead.getSettings());
        return true;
    }

    // tslint:disable-next-line:max-line-length
    public async onSettingUpdated(setting: ISetting, configModify: IConfigurationModify, read: IRead, http: IHttp): Promise<void> {
        this.settings.onUpdate(setting);
    }

    // tslint:disable-next-line:max-line-length
    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await this.settings.init(configuration.settings);
    }

    private buildIssueMatcher() {
        return new RegExp(`${this.settings.excludePatterns}|(${this.settings.issuePattern})`, 'g');
    }

}
