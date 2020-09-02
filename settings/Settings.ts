import {ISetting, SettingType} from "@rocket.chat/apps-engine/definition/settings";
import {ISettingsExtend} from "@rocket.chat/apps-engine/definition/accessors";
import {ISettingRead} from "@rocket.chat/apps-engine/definition/accessors/ISettingRead";

export class Settings {
    private readonly baseUrlSettingId: string = 'base-url';
    public baseUrl: string;

    private readonly issuePatternSettingId: string = 'issue-pattern';
    public issuePattern: string;
    public issueMatcher: RegExp;

    async init(settings: ISettingsExtend) {
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

    onUpdate(setting: ISetting) {
        switch (setting.id) {
            case this.baseUrlSettingId:
                this.extractedBaseUrl(setting.value);
                break;
            case this.issuePatternSettingId:
                this.extractedIssuePattern(setting.value);
                break;
        }
    }


    async setFrom(settings: ISettingRead) {
        this.extractedBaseUrl(await settings.getValueById(this.baseUrlSettingId));
        this.extractedIssuePattern(await settings.getValueById(this.issuePatternSettingId));
    }

    private extractedBaseUrl(value: string) {
        this.baseUrl = value;
    }

    private extractedIssuePattern(value: string) {
        this.issuePattern = value;
        this.issueMatcher = new RegExp(`(${value})`, 'g')
    }
}