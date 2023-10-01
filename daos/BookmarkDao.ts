/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookMarkDaoI from "../interfaces/bookMarkDao";
import Bookmark from "../models/bookmark/Bookmark";
import BookmarkModel from "../mongoose/bookmark/BookmarkModel";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage
 * of Bookmarks
 * @property {Bookmarks} Bookmarks Private single instance of UserDao
 */
export default class BookmarkDao implements BookMarkDaoI {
    /**
     * Uses BookmarkModel to insert new values in the bookmarks collection
     * @returns Promise To be notified when the bookmark is inserted in the
     * database
     */
    createBookmark =  async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.create({bookmarkedBy: uid, bookmarkedTuit: tid});

    /**
     * BookmarkModel to remove bookmark instance from the database.
     * @param {string} uid Primary key of user to be removed
     * @param {string} tid Primary key of tid to be removed
     * @returns Promise To be notified when bookmark instance is removed from the database
     */
    deleteBookmark = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({bookmarkedBy: uid, bookmarkedTuit: tid});
    /**
     * BookmarkModel to retrieve all bookmark documents from the bookmark collection
     * @returns Promise to to be notified when the bookmarks are retrieve from database
     */
    findAllBookmark = async (): Promise<Bookmark[]> =>
        BookmarkModel.find()
            .populate("bookmarkedBy")
            .populate("bookmarkedTuit")
            .exec();
    /**
     * BookmarkModel to retrieve all bookmarked tuits by a particular user from the bookmark collection
     * @param {string} uid User's primary key
     * @returns Promise to to be notified when the bookmarks are retrieve from database
     */
    findBookmarkByUser = async (uid: string): Promise<Bookmark[]> =>
        BookmarkModel.find({bookmarkedBy: uid})
            .populate({
                path: "bookmarkedTuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();
    /**
     * BookmarkModel to retrieve one instance of a bookmark tuit giving a particular user and a particular tuit
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     */
    findOneBookmark = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.findOne({bookmarkedBy: uid, bookmarkedTuit: tid})
            .populate({
                path: "bookmarkedTuit",
                populate: {
                    path: "bookmarkedBy"
                }
            })
            .exec();
}