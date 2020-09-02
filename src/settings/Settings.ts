import {ISettingsExtend} from '@rocket.chat/apps-engine/definition/accessors';
import {ISettingRead} from '@rocket.chat/apps-engine/definition/accessors/ISettingRead';
import {ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export class Settings {
    public readonly excludePatterns: string = '\\`\\`\\`[^\\`]+\\`\\`\\`' +
        '|\\`[^\\`]+\\`' +
        '|[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_\\+.~#?&//=]*';
    public baseUrl: string;
    public issuePattern: string;
    private readonly baseUrlSettingId: string = 'base-url';
    private readonly issuePatternSettingId: string = 'issue-pattern';

    public async init(settings: ISettingsExtend) {
        await settings.provideSetting({
            id: this.baseUrlSettingId,
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: true,
            i18nLabel: 'YouTrack_Base_URL',
            i18nDescription: 'YouTrack_Base_URL_Description',
        });
        await settings.provideSetting({
            id: this.issuePatternSettingId,
            type: SettingType.STRING,
            packageValue: '[a-zA-Z]+-[0-9]+',
            required: true,
            public: true,
            i18nLabel: 'Issue_Pattern',
            i18nDescription: 'Issue_Pattern_Description',
        });
    }

    public onUpdate(setting: ISetting) {
        switch (setting.id) {
            case this.baseUrlSettingId:
                this.extractedBaseUrl(setting.value);
                break;
            case this.issuePatternSettingId:
                this.extractedIssuePattern(setting.value);
                break;
        }
    }

    public async setFrom(settings: ISettingRead) {
        this.extractedBaseUrl(await settings.getValueById(this.baseUrlSettingId));
        this.extractedIssuePattern(await settings.getValueById(this.issuePatternSettingId));
    }

    private extractedBaseUrl(value: string) {
        this.baseUrl = value;
    }

    private extractedIssuePattern(value: string) {
        this.issuePattern = value;
    }
}
