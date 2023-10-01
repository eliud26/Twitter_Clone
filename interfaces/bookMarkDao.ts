import Bookmark from '../models/bookmark/Bookmark'

/**
 * @file declares API for Bookmark related data access object methods.
 */
export default interface BookMarkDao {
    createBookmark(uid: string, tid: string): Promise<any>;
    deleteBookmark(uid: string, tid: string): Promise<any>;
    findBookmarkByUser(uid: string): Promise<Bookmark[]>;
    findAllBookmark(): Promise<Bookmark[]>;
    findOneBookmark(uid: string, tid: string): Promise<any>;
}