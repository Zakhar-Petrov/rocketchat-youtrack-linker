import { expect } from 'chai';
import 'mocha';
import { stub } from 'sinon';
import { Settings } from '../settings/Settings';
import { TextMessage } from './TextMessage';

describe('TextMessage', () => {
    let settings: Settings;

    beforeEach(() => {
        settings = new Settings();
        stub(settings, 'baseUrl').get(function baseUrl() {
            return 'http://example.com';
        });
        stub(settings, 'issuePattern').get(function issuePattern() {
            return Settings.DEFAULT_ISSUE_PATTERN;
        });
    });

    const positiveParams = [
        'TEST-10',
        '>TEST-10',
        '~TEST-10~',
        'text TEST-10 text',
        'text TEST-10 text TEST-10',
    ];

    const negativeParams = [
        'text text',
        'http://example.com/TEST-10',
        '```\nTEST-10\n```',
        '~~~\nTEST-10\n~~~',
        '`TEST-10`',
    ];

    describe('#hasIssues', () => {
        positiveParams.forEach((text) => {
            it(`should return true for: '${text.replace(/\n/g, '\\n')}'`, async () => {
                const textMessage = new TextMessage(settings, text);

                // tslint:disable-next-line: no-unused-expression
                expect(await textMessage.hasIssues()).to.be.true;
            });
        });

        negativeParams.forEach((text) => {
            it(`should return false for: '${text.replace(/\n/g, '\\n')}'`, async () => {
                const textMessage = new TextMessage(settings, text);

                // tslint:disable-next-line: no-unused-expression
                expect(await textMessage.hasIssues()).to.be.false;
            });
        });
    });

    describe('#linkIssues', () => {
        positiveParams.forEach((text) => {
            it(`should link issues for: '${text.replace(/\n/g, '\\n')}'`, async () => {
                const textMessage = new TextMessage(settings, text);

                const expected = text.replace(/TEST-10/g, '[TEST-10](http://example.com/issue/TEST-10)');
                expect(await textMessage.linkIssues()).to.equal(expected);
            });
        });

        negativeParams.forEach((text) => {
            it(`should not link issues for: '${text.replace(/\n/g, '\\n')}'`, async () => {
                const textMessage = new TextMessage(settings, text);

                expect(await textMessage.linkIssues()).to.equal(text);
            });
        });
    });

});
