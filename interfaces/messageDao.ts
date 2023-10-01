import Message from "../models/message/Message"

/**
 * @file declares API for Message related data access object methods.
 */
export default interface MessageDao {
    createMessage(uid: string, suid: string, message: Message): Promise<any>;
    findMessagesByUser(uid: string, ruid: string): Promise<Message[]>;
    findMessagesToUser(uid: string, ruid: string): Promise<Message[]>;
    deleteMessage(uid: string, ruid: string, mid: string,): Promise<any>;
    updateMessage(uid: string, ruid: string, message: Message): Promise<any>;
    findAllMessages(): Promise<Message[]>;
}
