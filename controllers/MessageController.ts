/**
 * @file Controller RESTful Web service API for Bookmark resource
 */
import {Express, Request, Response} from "express";
import MessageDao from "../daos/MessageDao";
import FollowDao from "../daos/FollowDao";
import MessageControllerI from "../interfaces/messageController";

/**
 * @class MessageController Implements RESTful Web service API for message resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/message/users/:ruid to create a new message instance for a given tuit</li>
 *     <li>DELETE /api/users/message/:mid/users/:ruid to remove a particular message instance</li>
 *     <li>GET /api/users/:uid/user/messages/:ruid to retrieve all the messages instances sent by user to another</li>
 *     <li>GET /api/users/:uid/messages/user/:ruid to retrieve all of the messages instances sent to a user by another</li>
 *     <li>GET /api/users/ to retrieve all messages instances in the database</li>
 *     <li>PUT /api/user/:uid/update/message/users/:ruid to update a message instance </li>
 * </ul>
 * @property {app} Express instance
 * @property {MessageDao} messageDao DAO implementing message CRUD operations
 * @property {FollowDao} followDao DAO implementing follow CRUD operations
 */
export default class MessageController implements MessageControllerI {
    app: Express;
    messageDao: MessageDao
    followDao: FollowDao
    constructor(app: Express, messageDao: MessageDao, followDao: FollowDao) {
        this.app = app;
        this.messageDao = messageDao;
        this.followDao = followDao;
        this.app.post("/api/users/:uid/message/users/:ruid", this.createMessage);
        this.app.delete("/api/users/:uid/message/:mid/users/:ruid", this.deleteMessage);
        this.app.get("/api/users/:uid/user/messages/:ruid", this.findMessagesByUser);
        this.app.get("/api/users/:uid/messages/user/:ruid", this.findMessagesToUser);
        this.app.get("/api/messages", this.findAllMessages);
        this.app.put("/api/users/:uid/update/message/users/:ruid", this.updateMessage);
    }

    /**
     * Creates a message object to be sent to database collection
     * @param {Request} req represents request from client including body
     * containing the JSON object for the new message to be inserted in the database
     * @param {Response} res represents response to client, including the body formatted
     * as JSON containing the new message that was inserted in the database
     */
    createMessage = async (req: any, res: any) => {
        const uid = req.params.uid;
        const ruid = req.params.ruid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const findFollow = await this.followDao.findOneFollow(userId, ruid);
            if(findFollow) {
                this.messageDao.createMessage(userId, ruid, req.body.message)
                    .then(message => res.json(message));
            }
        }
        catch (e) {
            res.send(404);
        }
    }
    /**
     * Deletes a message object that contains the bookmarked tuit
     * @param {Request} req represents request from client including the
     * path parameters uid and ruid representing the sender user and the receiver user
     * primary's key
     * @param {Response} res represents response to client, including status on
     * whether deleting the message was successful or not
     */
    deleteMessage = (req: Request, res: Response) =>
        this.messageDao.deleteMessage(req.params.uid, req.params.ruid, req.params.mid)
            .then(status => res.json(status));
    /**
     * Retrieves all messages sent by a particular user
     * @param {Request} req represents request from client including the path parameter uid
     * representing the user's primary's key
     * @param {Response} res represents response to client, including the body formatted as JSON containing
     * the message object
     */
    findMessagesByUser = (req: any, res: any) => {
        let userId = req.params.ruid === "me"
        && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        this.messageDao.findMessagesByUser(userId, req.params.uid)
            .then(message => res.json(message));
    }
    /**
     * Retrieves all messages sent to a particular user
     * @param {Request} req represents request from client including the path parameter uid
     * representing the user's primary's key
     * @param {Response} res represents response from client including the body formatted as JSON containing
     * the message object
     */
    findMessagesToUser = (req: any, res: any) => {
        let userId = req.params.uid === "me"
        && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        this.messageDao.findMessagesToUser(userId, req.params.ruid)
            .then(message => res.send(message));
    }
    /**
     * Retrieves all messages stored in the database collection
     * @param {Request} req represents request from client
     * @param res represents response from client including the body formatted as JSON containing the array of messages
     */
    findAllMessages = (req: Request, res: Response) =>
        this.messageDao.findAllMessages()
            .then(message => res.json(message));

    /**
     * Updates a message stored in the database collection
     * @param {Request} req represents request from client including the path parameters uid and ruid
     * @param {Response} res represents response from client including status on whether update of message
     * was successful or not
     */
    updateMessage = (req: Request, res: Response) =>
        this.messageDao.updateMessage(req.params.uid, req.params.ruid, req.body)
            .then(status => res.json(status));

};