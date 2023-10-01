/**
 * @file Controller RESTful Web service API for Bookmark resource
 */
import {Express, Request, Response} from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/bookMarkController";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmark resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /users/:uid/tuits/:tid to create a new bookmark instance for a given tuit</li>
 *     <li>DELETE /users/:uid/tuits/:tid to remove a particular bookmark instance</li>
 *     <li>GET /users/:uid/tuits to retrieve all the tuit bookmark instances by user</li>
 *     <li>GET /users/tuits to retrieve all of the bookmark instances</li>
 *     <li>GET /users/:uid/tuits/:tid to retrieve one bookmark instance</li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao DAO implementing follow CRUD operations
 * @property {BookmarkController} bookmarkController controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    app: Express;
    bookmarkDao: BookmarkDao

    constructor(app: Express, bookmarkDao: BookmarkDao) {
        this.app = app;
        this.bookmarkDao = bookmarkDao;
        this.app.post("/users/:uid/bookmark/tuits/:tid", this.createBookmark);
        this.app.delete("/users/:uid/unbookmark/tuits/:tid", this.deleteBookmark);
        this.app.get("/users/:uid/bookmark/tuits", this.findBookmarkByUser);
        this.app.get("/bookmark", this.findAllBookmark);
        this.app.get("/users/:uid/bookmark/tuits/:tid", this.findOneBookmark);
    }

    /**
     * Creates a bookmark object to be sent to database collection
     * @param req {Request} req represents request from client including body
     * containing the JSON object for the new bookmark to be inserted in the database
     * @param res {Response} res represents response to client, including the body formatted
     * as JSON containing the new bookmark that was inserted in the database
     */
    createBookmark = async (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        console.log(userId)
        const bookmarkExists = await this.bookmarkDao.findOneBookmark(userId, tid);
        try {
            if (!bookmarkExists) {
                this.bookmarkDao.createBookmark(userId, tid)
                    .then(bookmark => {
                        res.json(bookmark)
                    })
                    .catch(e => {
                        console.log(e)
                        res.json(404)
                    })
            }
        }
        catch (e) {
            res.send(404);
            // res.sendStatus(200);
        }
     
    }
    /**
     * Deletes a bookmark object that contains the bookmark tuit
     * @param req {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param res {Response} res Represents response to client, including status
     * on whether deleting a bookmark was successful or not
     */
    deleteBookmark = (req: Request, res: Response) =>
        this.bookmarkDao.deleteBookmark(req.params.uid, req.params.tid)
            .then(status => res.json(status));
    /**
     * Retrieves all the tuits bookmark by a particular user and returns an array of bookmarked tuits
     * @param req {Request} req Represents request from client
     * @param res {Response} res Represents response to client, including the body formatted as JSON arrays
     * containing the bookmark objects
     */

    findBookmarkByUser = (req: any, res: Response) => {
        //console.log(req.params.uid);
        const id = req.params.uid === 'me' ? req.session['profile']._id : req.params.uid
        if(id === 'me') {
            return res.sendStatus(404)
        }
        this.bookmarkDao.findBookmarkByUser(id)
            .then(bookmark => res.json(bookmark));
    }

    /**
     * Retrieves all the bookmarked tuits stored in the bookmark collection from our database.
     * @param req {Request} req Represents request from client
     * @param res {Response} res Represents response to client, including the body formatted as JSON arrays
     * containing the bookmark objects
     */
    findAllBookmark = (req: Request, res: Response) =>
        this.bookmarkDao.findAllBookmark()
            .then(bookmark => res.send(bookmark));
    /**
     * Retrieves one instance of a bookmarked tuit stored in the bookmark collection from our database
     * @param req {Request} req Represents request from client
     * @param res {Response} res Represents response to client, including the body formatted as JSON arrays
     * containing the bookmark objects
     */
    findOneBookmark = (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        this.bookmarkDao.findOneBookmark(userId, tid)
            .then(bookmark => {
                const bookmarkNoNullTuits = bookmark.filter((bookmark: any) => bookmark.bookmarkedTuit);
                const tuitsFromBookmarks = bookmarkNoNullTuits.map((bookmark: any) => bookmark.bookmarkedTuit);
                res.json(tuitsFromBookmarks)
            });
    }

};