import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";
import DisLikeDao from "../daos/DislikeDao";
import LikeControllerI from "../interfaces/LikeControllerI";
import TuitDao from "../daos/TuitDao";


export default class LikeController implements LikeControllerI {
    app: Express;
    likeDao: LikeDao;
    tuitDao: TuitDao;
    dislikeDao: DisLikeDao;
    constructor(app: Express, likeDao: LikeDao, tuitDao: TuitDao, dislikeDao: DisLikeDao) {
        this.app = app;
        this.likeDao = likeDao;
        this.tuitDao = tuitDao;
        this.dislikeDao = dislikeDao;
        this.app.get("/api/users/:uid/likes", this.findAllTuitsLikedByUser);
        this.app.get("/api/users/:uid/dislikes", this.findAllTuitsDislikedByUser);
        this.app.get("/api/tuits/:tid/likes", this.findAllUsersThatLikedTuit);
        this.app.post("/api/users/:uid/likes/:tid", this.userLikesTuit);
        this.app.delete("/api/users/:uid/unlikes/:tid", this.userUnlikesTuit);
        this.app.put("/api/users/:uid/likes/:tid", this.userTuitLikes);
        this.app.put("/api/users/:uid/unlikes/:tid", this.userTuitDisLikes);
        this.app.post("/api/users/:uid/find-like/:tid", this.findUserLikesTuit);
        this.app.post("/api/users/:uid/find-dislike/:tid", this.findUserDisLikesTuit);
    }

    findAllUsersThatLikedTuit = (req: Request, res: Response) =>
        this.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then(likes => res.json(likes));

    findAllTuitsLikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        this.likeDao.findAllTuitsLikedByUser(userId)
            .then(likes => {
                const likesNonNullTuits = likes.filter(like => like.tuit);
                const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
                res.json(tuitsFromLikes);
            });
    }
    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        this.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then(dislikes => {
                const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
                const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
                res.json(tuitsFromDislikes);
            });
    }
    userLikesTuit = (req: Request, res: Response) =>
        this.likeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then(likes => res.json(likes));
    userUnlikesTuit = (req: Request, res: Response) =>
        this.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));
    findUserLikesTuit = (req: Request, res: Response) =>
        this.likeDao.findUserLikesTuit(req.params.uid, req.params.tid)
            .then(like => res.json(like));
    findUserDisLikesTuit = (req: Request, res: Response) =>
        this.dislikeDao.findUserDisLikesTuit(req.params.uid, req.params.tid)
            .then(like => res.json(like));

    userTuitLikes = async (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await this.likeDao
                .findUserLikesTuit(userId, tid);
            const userAlreadyDisLikedTuit = await this.dislikeDao
                .findUserDisLikesTuit(userId, tid);
            const howManyLikedTuit = await this.likeDao
                .countHowManyLikedTuit(tid);
            const howManyDisLikedTuit = await this.dislikeDao
                .countHowManyUnLikedTuit(tid);
            let tuit = await this.tuitDao.findTuitById(tid);
            if (!userAlreadyLikedTuit && !userAlreadyDisLikedTuit) {
                await this.likeDao.userLikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit + 1;
                tuit.stats.likeByFlag = true;
            }
            else if (userAlreadyLikedTuit && !userAlreadyDisLikedTuit){
                await this.likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
                tuit.stats.likeByFlag = false;
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid)
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else if(!userAlreadyLikedTuit && userAlreadyDisLikedTuit){
                await this.dislikeDao.DeleteUserDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit - 1;
                tuit.stats.dislikeByFlag = false;
                await this.likeDao.userLikesTuit(userId, tid)
                tuit.stats.likes = howManyLikedTuit + 1;
                tuit.stats.likeByFlag = true;
            }
            else {
                tuit.stats.dislikes = howManyDisLikedTuit;
                tuit.stats.likes = howManyLikedTuit;
            }
            await this.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }

    userTuitDisLikes = async (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await this.likeDao
                .findUserLikesTuit(userId, tid);
            const userAlreadyDisLikedTuit = await this.dislikeDao
                .findUserDisLikesTuit(userId, tid);
            const howManyLikedTuit = await this.likeDao
                .countHowManyLikedTuit(tid);
            const howManyDisLikedTuit = await this.dislikeDao
                .countHowManyUnLikedTuit(tid);
            let tuit = await this.tuitDao.findTuitById(tid);
            if (!userAlreadyLikedTuit && !userAlreadyDisLikedTuit) {
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else if (!userAlreadyLikedTuit && userAlreadyDisLikedTuit){
                await this.dislikeDao.DeleteUserDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit - 1;
                tuit.stats.dislikeByFlag = false;
                await this.likeDao.userLikesTuit(userId, tid)
                tuit.stats.likes = howManyLikedTuit + 1;
                tuit.stats.likeByFlag = true;
            }
            else if(userAlreadyLikedTuit && !userAlreadyDisLikedTuit){
                await this.likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
                tuit.stats.likeByFlag = false;
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid)
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else {
                tuit.stats.dislikes = howManyDisLikedTuit;
                tuit.stats.likes = howManyLikedTuit;
            }
            await this.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }


};