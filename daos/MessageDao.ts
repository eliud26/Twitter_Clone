/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose MessageDao
 * to integrate with MongoDB
 */
import MessageDaoI from "../interfaces/messageDao";
import MessageModel from "../mongoose/message/MessageModel";
import Message from "../models/message/Message";

/**
 * @class MessageDao Implements Data Access Object managing data storage
 * of Messages
 * @property {MessageDao} MessageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    /**
     * Uses MessageFollow to insert new values in the message collection
     * @returns Promise To be notified when the message is inserted in the
     * database
     */
    createMessage = async (uid: string, ruid: string, message: Message): Promise<any> =>
        MessageModel.create({sender: uid, receiver: ruid, message: message});

    /**
     * MessageModel to remove a message instance from the database.
     * @param {string} uid Primary key of user that sent message
     * @param {string} ruid Primary key of the receiver's message to be removed
     * @param {string} mid Primary key of the message itself
     * @returns Promise To be notified when message instance is removed from the database
     */
    deleteMessage =  async (uid: string, ruid: string, mid: string): Promise<any> =>
        MessageModel.deleteOne({sender: uid, receiver: ruid, _id: mid});

    /**
     * MessageModel to retrieve all messages sent by this user
     * @param {string} uid User's primary key
     * @param {string} ruid Receiver's primary key
     * @returns Promise to be notified when the messages are retrieve from database
     */
    findMessagesByUser = async (uid: string, ruid: string): Promise<Message[]> => {
        console.log("THIS IS FROM THE MESSAGE By USER")
        console.log("UID")
        console.log(uid)
        console.log("RUID")
        console.log(ruid)
        return MessageModel.find({sender: ruid, receiver: uid})
            .sort({'postedOn': -1})
            .populate({
                path: "sender",
                select: "username"
            })
            .exec();
    }

    /**
     * MessageModel to retrieve all messages sent to this user
     * @param {string} uid User's primary key
     * @param {string} ruid Receiver's primary key
     * @returns Promise to be notified when the messages are retrieve from database
     */
    findMessagesToUser = async (uid: string, ruid: string): Promise<Message[]> => {
        console.log("THIS IS FROM THE MESSAGE TO USER")
        console.log("UID")
        console.log(uid)
        console.log("RUID")
        console.log(ruid)
        return MessageModel.find({receiver: ruid, sender: uid})
            .sort({'postedOn': -1})
            .populate({
                path: "receiver",
                select: "username"
            })
            .exec();
    }

    /**
     * MessageModel to update a messages this user sent
     * @param {string} uid User's primary key
     * @param {string} ruid Other user's primary key
     * @param {Message} message object containing the message to be updated
     * @returns Promise to be notified when the message is updated
     */
    updateMessage = async (uid: string, ruid: string, message: Message): Promise<any> =>
        MessageModel.updateOne({sender: uid, receiver: ruid}, {$set: message});

    /**
     * MessageModel to retrieve all Messages stored in the message collection
     * @returns Promise to be notified when the follows are retrieve from database
     */
    findAllMessages = async (): Promise<Message[]> =>
        MessageModel.find()
            .populate("sender")
            .populate("receiver")
            .exec();

}

