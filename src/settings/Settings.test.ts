import { ISettingsExtend } from '@rocket.chat/apps-engine/definition/accessors';
import { ISettingRead } from '@rocket.chat/apps-engine/definition/accessors/ISettingRead';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { ISetting } from '@rocket.chat/apps-ts-definition/settings';
import { expect, should } from 'chai';
import 'mocha';
import { createSandbox } from 'sinon';
import { Settings } from './Settings';

describe('Settings', () => {
    describe('#onUpdate', () => {
        it('should set base url', () => {
            const settings = new Settings();
            const baseUrl = 'test-base-url';
            const setting = { id: Settings.BASE_URL_SETTING_ID, value: baseUrl } as ISetting;

            settings.onUpdate(setting);

            // tslint:disable: no-unused-expression
            expect(settings.baseUrl).to.equal(baseUrl);
            expect(settings.issuePattern).to.be.undefined;
            expect(settings.maxSearchAttempts).to.be.undefined;
            expect(settings.isModifyAttachments).to.be.undefined;
            // tslint:enable: no-unused-expression
        });

        it('should set issue pattern', () => {
            const settings = new Settings();
            const issuePattern = 'test-issue-pattern';
            const setting = { id: Settings.ISSUE_PATTERN_SETTING_ID, value: issuePattern } as ISetting;

            settings.onUpdate(setting);

            // tslint:disable: no-unused-expression
            expect(settings.issuePattern).to.equal(issuePattern);
            expect(settings.baseUrl).to.be.undefined;
            expect(settings.maxSearchAttempts).to.be.undefined;
            expect(settings.isModifyAttachments).to.be.undefined;
            // tslint:enable: no-unused-expression
        });

        it('should set max search attempts', () => {
            const settings = new Settings();
            const maxSearchAttempts = 123;
            const setting = { id: Settings.MAX_SEARCH_ATTEMPTS_ID, value: maxSearchAttempts } as ISetting;

            settings.onUpdate(setting);

            // tslint:disable: no-unused-expression
            expect(settings.maxSearchAttempts).to.equal(maxSearchAttempts);
            expect(settings.baseUrl).to.be.undefined;
            expect(settings.issuePattern).to.be.undefined;
            expect(settings.isModifyAttachments).to.be.undefined;
            // tslint:enable: no-unused-expression
        });

        it('should set modify attachments', () => {
            const settings = new Settings();
            const isModifyAttachments = true;
            const setting = { id: Settings.MODIFY_ATTACHMENTS_ID, value: isModifyAttachments } as ISetting;

            settings.onUpdate(setting);

            // tslint:disable: no-unused-expression
            expect(settings.isModifyAttachments).to.equal(isModifyAttachments);
            expect(settings.baseUrl).to.be.undefined;
            expect(settings.issuePattern).to.be.undefined;
            expect(settings.maxSearchAttempts).to.be.undefined;
            // tslint:enable: no-unused-expression
        });

        it('should set nothing', () => {
            const settings = new Settings();
            const setting = { id: 'unknown-setting', value: 'setting-test-value' } as ISetting;

            settings.onUpdate(setting);

            // tslint:disable: no-unused-expression
            should().not.exist(settings.baseUrl);
            should().not.exist(settings.issuePattern);
            should().not.exist(settings.maxSearchAttempts);
            should().not.exist(settings.isModifyAttachments);
            // tslint:enable: no-unused-expression
        });
    });

    describe('#setFrom', () => {
        it('should set base url', async () => {
            const settings = new Settings();
            const baseUrl = 'test-base-url';
            const settingRead = {
                async getValueById(id: string): Promise<any> {
                    if (id === Settings.BASE_URL_SETTING_ID) {
                        return baseUrl;
                    }
                    return null;
                },
            } as ISettingRead;

            await settings.setFrom(settingRead);

            expect(settings.baseUrl).to.equal(baseUrl);
            should().not.exist(settings.issuePattern);
            should().not.exist(settings.maxSearchAttempts);
            should().not.exist(settings.isModifyAttachments);
        });

        it('should set issue pattern', async () => {
            const settings = new Settings();
            const issuePattern = 'test-issue-pattern';
            const settingRead = {
                async getValueById(id: string): Promise<any> {
                    if (id === Settings.ISSUE_PATTERN_SETTING_ID) {
                        return issuePattern;
                    }
                    return null;
                },
            } as ISettingRead;

            await settings.setFrom(settingRead);

            expect(settings.issuePattern).to.equal(issuePattern);
            should().not.exist(settings.baseUrl);
            should().not.exist(settings.maxSearchAttempts);
            should().not.exist(settings.isModifyAttachments);
        });

        it('should set max search attempts', async () => {
            const settings = new Settings();
            const maxSearchAttempts = 123;
            const settingRead = {
                async getValueById(id: string): Promise<any> {
                    if (id === Settings.MAX_SEARCH_ATTEMPTS_ID) {
                        return maxSearchAttempts;
                    }
                    return null;
                },
            } as ISettingRead;

            await settings.setFrom(settingRead);

            expect(settings.maxSearchAttempts).to.equal(maxSearchAttempts);
            should().not.exist(settings.baseUrl);
            should().not.exist(settings.issuePattern);
            should().not.exist(settings.isModifyAttachments);
        });

        it('should set modify attachments', async () => {
            const settings = new Settings();
            const isModifyAttachments = true;
            const settingRead = {
                async getValueById(id: string): Promise<any> {
                    if (id === Settings.MODIFY_ATTACHMENTS_ID) {
                        return isModifyAttachments;
                    }
                    return null;
                },
            } as ISettingRead;

            await settings.setFrom(settingRead);

            expect(settings.isModifyAttachments).to.equal(isModifyAttachments);
            should().not.exist(settings.baseUrl);
            should().not.exist(settings.issuePattern);
            should().not.exist(settings.maxSearchAttempts);
        });

        it('should set nothing', async () => {
            const settings = new Settings();
            const settingRead = {
                async getValueById(_id: string): Promise<any> {
                    return null;
                },
            } as ISettingRead;

            await settings.setFrom(settingRead);

            should().not.exist(settings.baseUrl);
            should().not.exist(settings.issuePattern);
            should().not.exist(settings.maxSearchAttempts);
            should().not.exist(settings.isModifyAttachments);
        });
    });

    describe('#init', () => {
        const settingExtend = {
            async provideSetting(_setting: ISetting) {
                // nop
            },
        } as ISettingsExtend;
        const sandbox = createSandbox();
        let provideSetting;

        beforeEach(() => {
            provideSetting = sandbox.spy(settingExtend, 'provideSetting');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should provide settings', async () => {
            const settings = new Settings();

            await settings.init(settingExtend);

            // tslint:disable: no-unused-expression
            expect(provideSetting.callCount).to.equal(4);
            const baseUrlSetting = provideSetting.getCall(0).args[0];
            expect(baseUrlSetting.id).to.equal(Settings.BASE_URL_SETTING_ID);
            expect(baseUrlSetting.type).to.equal(SettingType.STRING);
            expect(baseUrlSetting.packageValue).to.equal('');
            expect(baseUrlSetting.required).to.be.true;
            expect(baseUrlSetting.public).to.be.true;
            expect(baseUrlSetting.i18nLabel).to.equal('YouTrack_Base_URL');
            expect(baseUrlSetting.i18nDescription).to.equal('YouTrack_Base_URL_Description');
            const issuePatternSetting = provideSetting.getCall(1).args[0];
            expect(issuePatternSetting.id).to.equal(Settings.ISSUE_PATTERN_SETTING_ID);
            expect(issuePatternSetting.type).to.equal(SettingType.STRING);
            expect(issuePatternSetting.packageValue).to.equal(Settings.DEFAULT_ISSUE_PATTERN);
            expect(issuePatternSetting.required).to.be.true;
            expect(issuePatternSetting.public).to.be.true;
            expect(issuePatternSetting.i18nLabel).to.equal('Issue_Pattern');
            expect(issuePatternSetting.i18nDescription).to.equal('Issue_Pattern_Description');
            const maxSearchAttemptsSetting = provideSetting.getCall(2).args[0];
            expect(maxSearchAttemptsSetting.id).to.equal(Settings.MAX_SEARCH_ATTEMPTS_ID);
            expect(maxSearchAttemptsSetting.type).to.equal(SettingType.NUMBER);
            expect(maxSearchAttemptsSetting.packageValue).to.equal(Settings.DEFAULT_MAX_SEARCH_ATTEMPTS);
            expect(maxSearchAttemptsSetting.required).to.be.true;
            expect(maxSearchAttemptsSetting.public).to.be.true;
            expect(maxSearchAttemptsSetting.i18nLabel).to.equal('Max_Search_Attempts');
            expect(maxSearchAttemptsSetting.i18nDescription).to.equal('Max_Search_Attempts_Description');
            const modifyAttachments = provideSetting.getCall(3).args[0];
            expect(modifyAttachments.id).to.equal(Settings.MODIFY_ATTACHMENTS_ID);
            expect(modifyAttachments.type).to.equal(SettingType.BOOLEAN);
            expect(modifyAttachments.packageValue).to.equal(Settings.DEFAULT_MODIFY_ATTACHMENTS);
            expect(modifyAttachments.required).to.be.true;
            expect(modifyAttachments.public).to.be.true;
            expect(modifyAttachments.i18nLabel).to.equal('Modify_Attachments');
            expect(modifyAttachments.i18nDescription).to.equal('Modify_Attachments_Description');
            // tslint:enable: no-unused-expression
        });
    });
});
