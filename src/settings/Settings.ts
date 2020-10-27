import { ISettingsExtend } from '@rocket.chat/apps-engine/definition/accessors';
import { ISettingRead } from '@rocket.chat/apps-engine/definition/accessors/ISettingRead';
import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export class Settings {

    public static readonly EXCLUDE_PATTERNS: string = '\\`\\`\\`[^\\`]+\\`\\`\\`' +
        '|\\~\\~\\~[^\\~]+\\~\\~\\~' +
        '|\\`[^\\`]+\\`' +
        '|[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_\\+.~#?&//=]*';

    public static readonly DEFAULT_BASE_URL: string = '';
    public static readonly DEFAULT_ISSUE_PATTERN: string = '[a-zA-Z]+-[0-9]+';
    public static readonly DEFAULT_MAX_SEARCH_ATTEMPTS: number = 25;
    public static readonly DEFAULT_MODIFY_ATTACHMENTS: boolean = false;

    public static readonly BASE_URL_SETTING_ID: string = 'base-url';
    public static readonly ISSUE_PATTERN_SETTING_ID: string = 'issue-pattern';
    public static readonly MAX_SEARCH_ATTEMPTS_ID: string = 'max-search-attempts';
    public static readonly MODIFY_ATTACHMENTS_ID: string = 'modify-attachments';

    private _baseUrl: string;

    get baseUrl(): string {
        return this._baseUrl;
    }

    private _issuePattern: string;

    get issuePattern(): string {
        return this._issuePattern;
    }

    private _maxSearchAttempts: number;

    get maxSearchAttempts(): number {
        return this._maxSearchAttempts;
    }

    private _isModifyAttachments: boolean;

    get isModifyAttachments(): boolean {
        return this._isModifyAttachments;
    }

    public async init(settings: ISettingsExtend) {
        await settings.provideSetting({
            id: Settings.BASE_URL_SETTING_ID,
            type: SettingType.STRING,
            packageValue: Settings.DEFAULT_BASE_URL,
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
        await settings.provideSetting({
            id: Settings.MAX_SEARCH_ATTEMPTS_ID,
            type: SettingType.NUMBER,
            packageValue: Settings.DEFAULT_MAX_SEARCH_ATTEMPTS,
            required: true,
            public: true,
            i18nLabel: 'Max_Search_Attempts',
            i18nDescription: 'Max_Search_Attempts_Description',
        });
        await settings.provideSetting({
            id: Settings.MODIFY_ATTACHMENTS_ID,
            type: SettingType.BOOLEAN,
            packageValue: Settings.DEFAULT_MODIFY_ATTACHMENTS,
            required: true,
            public: true,
            i18nLabel: 'Modify_Attachments',
            i18nDescription: 'Modify_Attachments_Description',
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
            case Settings.MAX_SEARCH_ATTEMPTS_ID:
                this.extractedMaxSearchAttempts(setting.value);
                break;
            case Settings.MODIFY_ATTACHMENTS_ID:
                this.extractedModifyAttachments(setting.value);
                break;
        }
    }

    public async setFrom(settings: ISettingRead) {
        this.extractedBaseUrl(await settings.getValueById(Settings.BASE_URL_SETTING_ID));
        this.extractedIssuePattern(await settings.getValueById(Settings.ISSUE_PATTERN_SETTING_ID));
        this.extractedMaxSearchAttempts(await settings.getValueById(Settings.MAX_SEARCH_ATTEMPTS_ID));
        this.extractedModifyAttachments(await settings.getValueById(Settings.MODIFY_ATTACHMENTS_ID));
    }

    private extractedBaseUrl(value: string) {
        this._baseUrl = value;
    }

    private extractedIssuePattern(value: string) {
        this._issuePattern = value;
    }

    private extractedMaxSearchAttempts(value: number) {
        this._maxSearchAttempts = value;
    }

    private extractedModifyAttachments(value: boolean) {
        this._isModifyAttachments = value;
    }
}
