import {IHttp, IMessageBuilder, IPersistence, IRead} from '@rocket.chat/apps-engine/definition/accessors';
import {IMessage} from "@rocket.chat/apps-engine/definition/messages";
import {expect} from 'chai';
import 'mocha';

import {stub} from 'sinon';
import {Settings} from '../settings/Settings';
import {MessageHandler} from './MessageHandler';

describe('MessageHandler', () => {
    let settings;
    let message;
    let read;
    let http;
    let messageBuilder;
    let persistence;

    beforeEach(function () {
        settings = new Settings();
        stub(settings, 'baseUrl').get(function baseUrl() {
            return 'http://example.com';
        });
        stub(settings, 'issuePattern').get(function issuePattern() {
            return Settings.DEFAULT_ISSUE_PATTERN;
        });
        message = <IMessage>{};
        read = <IRead>{};
        http = <IHttp>{};
        messageBuilder = <IMessageBuilder>{
            setText(text: string): IMessageBuilder {
                return this;
            },
            getMessage(): IMessage {
                return <IMessage>{};
            }
        };
        persistence = <IPersistence>{};
    });

    describe('#checkPreMessageSentModify', () => {
        it('should return true', async () => {
            message.text = 'TEST-10';
            const messageHandler = new MessageHandler(settings);

            expect(await messageHandler.checkPreMessageSentModify(message, read, http)).to.be.true;
        });
        it('should return false', async () => {
            message.text = null;
            const messageHandler = new MessageHandler(settings);

            expect(await messageHandler.checkPreMessageSentModify(message, read, http)).to.be.false;
        });
        it('should return false', async () => {
            message.text = undefined;
            const messageHandler = new MessageHandler(settings);

            expect(await messageHandler.checkPreMessageSentModify(message, read, http)).to.be.false;
        });
    });

    describe('#executePreMessageSentModify', () => {
        it('should return changed', async () => {
            message.text = 'TEST-10';
            const messageHandler = new MessageHandler(settings);

            expect(await messageHandler.executePreMessageSentModify(message, messageBuilder, read, http, persistence))
                .to.not.equal(message);
        });
        it('should return the same', async () => {
            message.text = null;
            const messageHandler = new MessageHandler(settings);

            expect(await messageHandler.executePreMessageSentModify(message, messageBuilder, read, http, persistence))
                .to.equal(message);
        });
        it('should return the same', async () => {
            message.text = undefined;
            const messageHandler = new MessageHandler(settings);

            expect(await messageHandler.executePreMessageSentModify(message, messageBuilder, read, http, persistence))
                .to.equal(message);
        });
    });
});