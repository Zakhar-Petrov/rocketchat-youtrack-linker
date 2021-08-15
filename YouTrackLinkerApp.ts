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
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPreMessageSentModify, IPreMessageUpdatedModify } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { ISetting } from '@rocket.chat/apps-engine/definition/settings';
import { MessageHandler } from './src/handler/MessageHandler';
import { Settings } from './src/settings/Settings';

export class YouTrackLinkerApp extends App implements IPreMessageSentModify, IPreMessageUpdatedModify {

    private readonly settings: Settings = new Settings();
    private readonly messageHandler: MessageHandler;

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
        this.messageHandler = new MessageHandler(this.settings);
    }

    public async checkPreMessageSentModify(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        return this.messageHandler.checkPreMessageModify(message, read, http);
    }

    public async checkPreMessageUpdatedModify(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        return this.messageHandler.checkPreMessageModify(message, read, http);
    }

    // tslint:disable-next-line:max-line-length
    public async executePreMessageSentModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        return this.messageHandler.executePreMessageModify(message, builder, read, http, persistence);
    }

    // tslint:disable-next-line:max-line-length
    public async executePreMessageUpdatedModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        return this.messageHandler.executePreMessageModify(message, builder, read, http, persistence);
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

}
