/**
 * @file Controller RESTful Web service API for Follow resource
 */
import {Express, Request, Response} from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/followController";
import Follow from "../models/follow/Follow"

/**
 * @class FollowController Implements RESTful Web service API for follow resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /users/:uid/follow/users/:fuid to create a new follow instance for a given user</li>
 *     <li>DELETE /users/:uid/unfollow/users/:fuid to remove a particular tuit instance</li>
 *     <li>GET /follows to retrieve all the tuit instances</li>
 *     <li>GET /users/:uid/followers to retrieve all of the followers of a particular user</li>
 *     <li>GET /users/:uid/following to retrieve all users this user is following</li>
 *     <li>GET /users/:uid/follow/users/:fuid to retrieve on particular follower</li>
 * </ul>
 * @property {FollowDao} followDao DAO implementing follow CRUD operations
 * @property {FollowController} followController controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    app: Express;
    followDao: FollowDao
    constructor(app: Express, followDao: FollowDao) {
        this.app = app;
        this.followDao = followDao;
        this.app.post("/api/users/:uid/follow/users/:fuid", this.createFollow);
        this.app.delete("/api/users/:uid/unfollows/user/:fuid", this.deleteFollow);
        this.app.get("/api/follows", this.findAllFollow);
        this.app.get("/api/users/:uid/followers", this.findAllUsersFollowingThisUser);
        this.app.get("/api/users/:uid/following", this.findAllUsersThisUserFollows);
        this.app.get("/api/users/:uid/follow/users/:fuid", this.findOneFollow);
    }

    /**
     * Creates a follow object to be sent to the database collection
     * @param req {Request} represents request from client including body
     * containing the JSON object for the new follow to be inserted in the database
     * @param res {Response} represents response to client, including the body formatted
     * as JSON containing the new follow that was inserted in the database
     */
    createFollow = async (req: any, res: any) => {
        let userId = req.params.uid === "me"
        && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        const existentFollow = await this.followDao.findOneFollow(userId, req.params.fuid);
        try {
            if (!existentFollow) {
                this.followDao.createFollow(userId, req.params.fuid)
                    .then(follows => res.json(follows));
            }
            res.status(200);
        }
        catch (e) {
            res.status(404)
        }
    }
    /**
     * Deletes a follow object that contains the follower, following relation between two users
     * @param req {Request} req Represents request from client, including path
     * parameters uid and fuid identifying the primary key of the users follow relation to be removed
     * @param res {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    deleteFollow = (req: Request, res: Response) =>
        this.followDao.deleteFollow(req.params.uid, req.params.fuid)
            .then(status => res.json(status));
    /**
     * Retrieves all follows from the database
     */
    findAllFollow = (req: Request, res: Response) =>
        this.followDao.findAllFollow()
            .then(follows => res.json(follows));
    /**
     * Retrieves all users following this user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user's primary's key
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow object
     */
    findAllUsersFollowingThisUser = (req: Request, res: Response) =>
        this.followDao.findAllUsersFollowingThisUser(req.params.uid)
            .then(follow => res.send(follow));
    /**
     * Retrieves all this particular user follows from the database
     * @param {Request} req Represents request from client including the path
     * parameter uid representing the user's primary's key
     * @param {Response} res Represents response to client including the
     * body formatted as JSON arrasys containing the follow object
     */
    findAllUsersThisUserFollows = (req: any, res: any) => {
        let userId = req.params.uid === "me"
        && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        this.followDao.findAllUsersThisUserFollows(userId)
            .then((follow: Follow[]) => res.json(follow));
    }
    /**
     * Retrieves all this particular user follows from the database
     * @param {Request} req Represents request from client including the path
     * parameter uid representing the user's primary's key and fuid
     * representing the other user's primary's key
     * @param {Response} res Represents response to client including the
     * body formatted as JSON arrays containing the follow object
     */
    findOneFollow = (req: any, res: any) => {
        let userId = req.params.uid === "me"
        && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        this.followDao.findOneFollow(userId, req.params.fuid)
            .then(follow => res.json(follow));
    }
};