import {Request, Response} from "express";

/**
 * @file declares API calls for the Image controller.
 */
export default interface ImageControllerI {
    createImage (req: Request, res: Response): void;
    deleteImage (req: Request, res: Response): void;
    findImagesByUser(req: Request, res: Response): void;
    findImagesToUser (req: Request, res: Response): void;
    findAllImages(req: Request, res: Response): void
};