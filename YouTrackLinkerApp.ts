import {
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IMessageBuilder,
    IPersistence,
    IRead
} from '@rocket.chat/apps-engine/definition/accessors';
import {App} from '@rocket.chat/apps-engine/definition/App';
import {IAppInfo} from '@rocket.chat/apps-engine/definition/metadata';
import {IMessage, IPreMessageSentModify} from '@rocket.chat/apps-engine/definition/messages';
import {ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export class YouTrackLinkerApp extends App implements IPreMessageSentModify {

    private readonly matcher: RegExp = /([A-Z]+-[0-9]+)/g;
    private readonly baseUrlSettingId: string = 'base-url';
    private baseUrl: string;

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

    // tslint:disable-next-line:max-line-length
    public async executePreMessageSentModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        if (typeof message.text !== 'string') {
            return message;
        }
        return builder.setText(message.text.replace(this.matcher, `[$1](${this.baseUrl}/issue/$1)`)).getMessage();
    }

    public async onEnable(environmentRead: IEnvironmentRead, configModify: IConfigurationModify): Promise<boolean> {
        this.baseUrl = await environmentRead.getSettings().getValueById(this.baseUrlSettingId);
        return true;
    }

    // tslint:disable-next-line:max-line-length
    public async onSettingUpdated(setting: ISetting, configModify: IConfigurationModify, read: IRead, http: IHttp): Promise<void> {
        switch (setting.id) {
            case this.baseUrlSettingId:
                this.baseUrl = await setting.value;
                break;
        }
    }

    // tslint:disable-next-line:max-line-length
    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configuration.settings.provideSetting({
            id: this.baseUrlSettingId,
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'YouTrack_Base_URL',
            i18nDescription: 'YouTrack_Base_URL_Description',
        });
    }

}
