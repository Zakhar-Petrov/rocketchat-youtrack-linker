import { IHttp, IMessageBuilder, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage, IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { Settings } from '../settings/Settings';
import { TextMessage } from './TextMessage';

export class MessageHandler {

    private readonly settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    public async checkPreMessageModify(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        if (message.text && await this.hasIssues(message.text)) {
            return true;
        }

        if (this.settings.isModifyAttachments && message.attachments) {
            for (const attachment of message.attachments) {
                if (attachment.text && await this.hasIssues(attachment.text)) {
                    return true;
                }
            }
        }

        return false;
    }

    // tslint:disable-next-line:max-line-length
    public async executePreMessageModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
        if (message.text) {
            await this.modifyText(message.text).then((messageText) => builder.setText(messageText));
        }

        if (this.settings.isModifyAttachments && message.attachments) {
            await this.modifyAttachments(message.attachments).then((attachments) => builder.setAttachments(attachments));
        }

        return builder.getMessage();
    }

    private async hasIssues(text: string): Promise<boolean> {
        return this.textMessage(text).hasIssues();
    }

    private async modifyText(text: string): Promise<string> {
        return this.textMessage(text).linkIssues();
    }

    private async modifyAttachments(attachments: Array<IMessageAttachment>): Promise<Array<IMessageAttachment>> {
        return Promise.all(attachments.map((attachment) => this.modifyAttachment(attachment)));
    }

    private async modifyAttachment(attachment: IMessageAttachment): Promise<IMessageAttachment> {
        if (attachment.text) {
            const newAttachment: IMessageAttachment = { ...attachment, text: await this.modifyText(attachment.text) };
            return newAttachment;
        }
        return attachment;
    }

    private textMessage(text: string) {
        return new TextMessage(this.settings, text);
    }

}
