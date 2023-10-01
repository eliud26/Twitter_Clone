import {Request, Response} from "express";

/**
 * @file declares API calls for the Follow controller.
 */
export default interface FollowControllerI {
    createFollow (req: Request, res: Response): void;
    deleteFollow (req: Request, res: Response): void;
    findAllFollow(req: Request, res: Response): void;
    findAllUsersFollowingThisUser (req: Request, res: Response): void;
    findAllUsersThisUserFollows (req: Request, res: Response): void
    findOneFollow (req: Request, res: Response): void
};