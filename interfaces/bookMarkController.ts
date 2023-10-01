import {Request, Response} from "express";

/**
 * @file declares controller calls for the Bookmark controller.
 */
export default interface BookMarkControllerI {
    createBookmark (req: Request, res: Response): void;
    deleteBookmark (req: Request, res: Response): void;
    findBookmarkByUser(req: Request, res: Response): void;
    findAllBookmark (req: Request, res: Response): void;
    findOneBookmark (req: Request, res: Response): void
};