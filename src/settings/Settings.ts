import {ISettingsExtend} from '@rocket.chat/apps-engine/definition/accessors';
import {ISettingRead} from '@rocket.chat/apps-engine/definition/accessors/ISettingRead';
import {ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export class Settings {
    public static readonly DEFAULT_ISSUE_PATTERN: string = '[a-zA-Z]+-[0-9]+';
    public static readonly EXCLUDE_PATTERNS: string = '\\`\\`\\`[^\\`]+\\`\\`\\`' +
        '|\\`[^\\`]+\\`' +
        '|[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_\\+.~#?&//=]*';

    public static readonly BASE_URL_SETTING_ID: string = 'base-url';
    public static readonly ISSUE_PATTERN_SETTING_ID: string = 'issue-pattern';

    public baseUrl: string;
    public issuePattern: string;

    public async init(settings: ISettingsExtend) {
        await settings.provideSetting({
            id: Settings.BASE_URL_SETTING_ID,
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: true,
            i18nLabel: 'YouTrack_Base_URL',
            i18nDescription: 'YouTrack_Base_URL_Description',
        });
        await settings.provideSetting({
            id: Settings.ISSUE_PATTERN_SETTING_ID,
            type: SettingType.STRING,
            packageValue: Settings.DEFAULT_ISSUE_PATTERN,
            required: true,
            public: true,
            i18nLabel: 'Issue_Pattern',
            i18nDescription: 'Issue_Pattern_Description',
        });
    }

    public onUpdate(setting: ISetting) {
        switch (setting.id) {
            case Settings.BASE_URL_SETTING_ID:
                this.extractedBaseUrl(setting.value);
                break;
            case Settings.ISSUE_PATTERN_SETTING_ID:
                this.extractedIssuePattern(setting.value);
                break;
        }
    }

    public async setFrom(settings: ISettingRead) {
        this.extractedBaseUrl(await settings.getValueById(Settings.BASE_URL_SETTING_ID));
        this.extractedIssuePattern(await settings.getValueById(Settings.ISSUE_PATTERN_SETTING_ID));
    }

    private extractedBaseUrl(value: string) {
        this.baseUrl = value;
    }

    private extractedIssuePattern(value: string) {
        this.issuePattern = value;
    }
}
