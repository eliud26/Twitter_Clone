import DisLike from "../models/dislikes/Dislike";

/**
 * @file Declares API for Likes related data access object methods
 */
export default interface LikeDaoI {
    findAllUsersThatDisLikedTuit (tid: string): Promise<DisLike[]>;
    findAllTuitsDislikedByUser (uid: string): Promise<DisLike[]>;
    findUserDisLikesTuit(uid: string, tid: string): Promise<undefined>;
    countHowManyUnLikedTuit(tid: string): Promise<any>;
    DeleteUserDislikesTuit(tid: string, uid: string): Promise<any>;
    CreateUserDisLikesTuit(tid: string, uid: string): Promise<any>;
};