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
import {TextMessage} from './src/settings/TextMessage';

export class YouTrackLinkerApp extends App implements IPreMessageSentModify {

    private readonly settings: Settings = new Settings();

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async checkPreMessageSentModify(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        if (typeof message.text !== 'string') {
            return false;
        }

        return this.textMessage(message.text).hasIssues();
    }

    // tslint:disable-next-line:max-line-length
    public async executePreMessageSentModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        if (typeof message.text !== 'string') {
            return message;
        }

        return this.textMessage(message.text).linkIssues().then(
            (linkedText) => builder.setText(linkedText).getMessage(),
        );
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

    private textMessage(text: string) {
        return new TextMessage(this.settings, text);
    }

}
