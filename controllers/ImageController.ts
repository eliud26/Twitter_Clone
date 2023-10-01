/**
 * @file Controller RESTful Web service API for Image resource
 */
import {Express, Request, Response} from "express";
import ImageDao from '../daos/ImageDao'
import FollowDao from '../daos/FollowDao'
import ImageControllerI from '../interfaces/imageController';

/**
 * @class ImageController controller implementing RESTful Web service API for image resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/image/user/:ruid to create a new image instance</li>
 *     <li>DELETE /api/users/:uid/image/:iid/user/:ruid to remove a particular image instance</li>
 *     <li>GET /api/users/:uid/image/user/:ruid to retrieve all the images instances by user particular user sent to another</li>
 *     <li>GET /api/users/:uid/user/image/:ruid to retrieve all the images instances sent to this user by another</li>
 * </ul>
 *
 * @property {app} Express instance
 * @property {ImageDao} imageDao DAO implementing image CRUD operations
 * @property {FollowDao} followDao DAO implementing follow CRUD operations
 */
export default class ImageController implements ImageControllerI {
    app: Express;
    imageDao: ImageDao;
    followDao: FollowDao;
    constructor(app: Express, imageDao: ImageDao, followDao: FollowDao) {
        this.app = app;
        this.imageDao = imageDao;
        this.followDao = followDao;
        this.app.post('/api/users/:uid/image/user/:ruid', this.createImage)
        this.app.delete('/api/users/:uid/image/:iid/user/:ruid', this.deleteImage)
        this.app.get('/api/users/:uid/user/images/:ruid', this.findImagesByUser)
        this.app.get('/api/users/:uid/images/user/:ruid', this.findImagesToUser)
    }
    /**
     * Creates a Image object to be sent to database collection
     * @param {Request} req represents request from client including body
     * containing the JSON object for the new image to be inserted in the database
     * @param {Response} res represents response to client, including the body formatted
     * as JSON containing the new image that was inserted in the database
     */
    createImage = async (req: any, res: any) => {
        const uid = req.params.uid;
        const ruid = req.params.ruid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        const followExist = await this.followDao.findOneFollow(userId, ruid);
        if(followExist) {
            await this.imageDao.createImage(userId, ruid, req.body.urlImage)
                .then(image => {
                    res.json(image)
                });
        }
    }
    /**
     * Deletes a image object to be sent to database collection
     * @param {Request} req represents request from client including body
     * containing the JSON object for the new image to be inserted in the database
     * @param {Response} res represents response to client, including the body formatted
     * as JSON containing the new image that was inserted in the database
     */
    deleteImage = async (req: Request, res: Response) =>
        this.imageDao.deleteImage(req.params.uid, req.params.ruid, req.params.iid)
            .then(status => res.json(status))
    /**
     * Retrieves all images sent by a particular user
     * @param {Request} req represents request from client including the path parameter uid
     * representing the user's primary's key
     * @param {Response} res represents response to client, including the body formatted as JSON containing
     * the image object
     */
    findImagesByUser = async (req: any, res: any) => {
        let userId = req.params.ruid === "me"
        && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        await this.imageDao.findImagesByUser(userId, req.params.uid)
            .then(image => res.send(image));
    }
    /**
     * Retrieves all images sent to a particular user
     * @param {Request} req represents request from client including the path parameter uid
     * representing the user's primary's key
     * @param {Response} res represents response from client including the body formatted as JSON containing
     * the iamge object
     */
    findImagesToUser = async (req: any, res: any) => {
        let userId = req.params.uid === "me"
        && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        await this.imageDao.findImagesToUser(userId, req.params.ruid)
            .then(image => res.json(image));
    }
    /**
     * Retrieves all images in the database
     * @param {Request} req represents request from client including the path parameter uid
     * representing the user's primary's key
     * @param {Response} res represents response from client including the body formatted as JSON containing
     * the image object
     */
    findAllImages = async (req: Request, res: Response) =>
        this.imageDao.findAllImages()
            .then(images => res.json(images));


}