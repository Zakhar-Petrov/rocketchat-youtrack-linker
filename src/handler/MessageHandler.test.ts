import { IHttp, IMessageBuilder, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage, IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { expect } from 'chai';
import 'mocha';
import { stub } from 'sinon';
import { Settings } from '../settings/Settings';
import { MessageHandler } from './MessageHandler';


describe('MessageHandler', () => {
    let settings: Settings;
    let message: IMessage;
    let read: IRead;
    let http: IHttp;
    let messageBuilder: IMessageBuilder;
    let builderText: string | undefined;
    let builderAttachments: Array<IMessageAttachment> | undefined;
    let builderMessage: IMessage;
    let persistence: IPersistence;

    beforeEach(() => {
        settings = new Settings();
        stub(settings, 'baseUrl').get(function baseUrl() {
            return 'http://example.com';
        });
        stub(settings, 'issuePattern').get(function issuePattern() {
            return Settings.DEFAULT_ISSUE_PATTERN;
        });
        stub(settings, 'isModifyAttachments').get(function isModifyAttachments() {
            return true;
        });
        message = ({} as IMessage);
        read = ({} as IRead);
        http = ({} as IHttp);
        builderText = undefined;
        builderMessage = ({} as IMessage);

        messageBuilder = ({
            setText(text: string): IMessageBuilder {
                builderText = text;
                return this;
            },
            setAttachments(attachments: Array<IMessageAttachment>): IMessageBuilder {
                builderAttachments = attachments;
                return this;
            },
            getMessage(): IMessage {
                builderMessage.text = message.text;
                builderMessage.attachments = message.attachments;
                if (builderText) {
                    builderMessage.text = builderText;
                }
                if (builderAttachments) {
                    builderMessage.attachments = builderAttachments;
                }
                return builderMessage;
            },
        } as IMessageBuilder);
        persistence = ({} as IPersistence);
    });

    describe('#checkPreMessageSentModify', () => {
        describe('should return true', () => {
            it('issue in message text', async () => {
                message.text = 'TEST-10';
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.true;
            });
            it('issue in attachment', async () => {
                message.text = 'There is no any issue in message text';
                message.attachments = [{ text: 'But there is an issue in attachment: TEST-10' }];
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.true;
            });
            it('undefinded message text and issue in attachment', async () => {
                message.text = undefined;
                message.attachments = [{ text: 'But there is an issue in attachment: TEST-10' }];
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.true;
            });
            it('empty message text and issue in attachment', async () => {
                message.text = '';
                message.attachments = [{ text: 'But there is an issue in attachment: TEST-10' }];
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.true;
            });
            it('issue in message text and attachment', async () => {
                message.text = 'There is an issue in message text: TEST-10';
                message.attachments = [{ text: 'There is an issue in attachment: TEST-10' }];
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.true;
            });
        });

        describe('should return false', () => {
            it('no any issue in message text and no any attachment', async () => {
                message.text = 'There is no any issue in message text';
                const messageHandler = new MessageHandler(settings);
                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.false;
            });
            it('undefinded message text and no any attachment', async () => {
                message.text = undefined;
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.false;
            });
            it('empty message text and no any attachment', async () => {
                message.text = '';
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.false;
            });
            it('undefinded message text and no any issue in attachment', async () => {
                message.text = undefined;
                message.attachments = [{ text: 'There is no any issue in attachment' }];
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.false;
            });
            it('empty message text and no any attachment', async () => {
                message.text = '';
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.false;
            });
            it('no any issue in message text and attachment', async () => {
                message.text = 'There is no any issue in message text';
                message.attachments = [{ text: 'And there is no any issue in message attachments' }];
                const messageHandler = new MessageHandler(settings);

                // tslint:disable-next-line: no-unused-expression
                expect(await messageHandler.checkPreMessageModify(message, read, http)).to.be.false;
            });
        });
    });

    describe('#executePreMessageSentModify', () => {
        it('should return changed message text', async () => {
            message.text = 'There is an issue in message text: TEST-10';
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).text)
                .to.not.equal(message.text);
        });
        it('should return the same message text', async () => {
            message.text = 'There is no any issue in message text';
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).text)
                .to.equal(message.text);
        });
        it('should return the same message text', async () => {
            message.text = undefined;
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).text)
                .to.equal(message.text);
        });

        it('should return changed attachment', async () => {
            message.text = '';
            message.attachments = [{ text: 'There is an issue in attachment: TEST-10' }];
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).attachments)
                .to.not.eql(message.attachments);
        });
        it('should return the same attachment', async () => {
            message.text = '';
            message.attachments = [{ text: 'There is no any issue in attachment' }];
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).attachments)
                .to.eql(message.attachments);
        });
        it('should return the same attachment', async () => {
            message.text = '';
            message.attachments = [{ text: undefined }];
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).attachments)
                .to.eql(message.attachments);
        });
        it('should return the same attachment', async () => {
            message.text = '';
            message.attachments = [{ text: '' }];
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).attachments)
                .to.eql(message.attachments);
        });

        it('should return changed message text and attachment', async () => {
            message.text = 'There is an issue in message text: TEST-10';
            message.attachments = [{ text: 'There is an issue in attachment: TEST-10' }];
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).text)
                .to.not.equal(message.text);
            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).attachments)
                .to.not.eql(message.attachments);
        });
        it('should return the same message text and attachment', async () => {
            message.text = 'There is no any issue in message text';
            message.attachments = [{ text: 'There is no any issue in attachment' }];
            const messageHandler = new MessageHandler(settings);

            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).text)
                .to.equal(message.text);
            expect((await messageHandler.executePreMessageModify(message, messageBuilder, read, http, persistence)).attachments)
                .to.eql(message.attachments);
        });
    });
});
