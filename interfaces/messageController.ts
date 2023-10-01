import {Request, Response} from "express";
import Message from "../models/message/Message";

/**
 * @file declares API calls for the Message controller.
 */
export default interface MessageControllerI {
    createMessage (req: Request, res: Response): void;
    deleteMessage (req: Request, res: Response): void;
    findMessagesByUser(req: Request, res: Response): void;
    findMessagesToUser (req: Request, res: Response): void;
    findAllMessages(req: Request, res: Response): void
    updateMessage(req: Request, res: Response): void
};