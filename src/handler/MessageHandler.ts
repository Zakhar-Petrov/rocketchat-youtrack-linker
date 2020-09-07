import {IHttp, IMessageBuilder, IPersistence, IRead} from '@rocket.chat/apps-engine/definition/accessors';
import {IMessage, IPreMessageSentModify} from '@rocket.chat/apps-engine/definition/messages';
import {Settings} from '../settings/Settings';
import {TextMessage} from './TextMessage';

export class MessageHandler implements IPreMessageSentModify {

    private readonly settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    public async checkPreMessageSentModify(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        if (typeof message.text !== 'string') {
            return false;
        }

        return this.textMessage(message.text).hasIssues();
    }

    // tslint:disable-next-line:max-line-length
    public async executePreMessageSentModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        if (typeof message.text !== 'string') {
            return message;
        }

        return this.textMessage(message.text).linkIssues().then(
            (linkedText) => builder.setText(linkedText).getMessage(),
        );
    }

    private textMessage(text: string) {
        return new TextMessage(this.settings, text);
    }
}
