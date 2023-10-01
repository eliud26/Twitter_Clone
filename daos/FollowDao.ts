/**
 * @file Implements DAO managing data storage of Follow. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowDaoI from "../interfaces/followDao";
import FollowModel from "../mongoose/follow/FollowModel";
import Follow from "../models/follow/Follow";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follow
 * @property {FollowDao} FollowDao Private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI {
    /**
     * Uses FollowModel to insert new values in the follow collection
     * @returns Promise To be notified when the follow is inserted in the
     * database
     */
    createFollow = async (uid: string, following: string): Promise<any> =>
        FollowModel.create({user: uid, following: following});

    /**
     * Removes follow instance from the database.
     * @param {string} uid Primary key of user to be removed
     * @param {string} follow Primary key of the other user to be removed
     * @returns Promise To be notified when bookmark instance is removed from the database
     */
    deleteFollow =  async (uid: string, follow: string): Promise<any> =>
        FollowModel.deleteOne({user: uid, following: follow});

    /**
     * FollowModel to retrieve all follow documents from the follow collection
     * @returns Promise to to be notified when the follows are retrieve from database
     */
    findAllFollow = async (): Promise<Follow[]> =>
        FollowModel.find()
            .populate("following")
            .exec();

    /**
     * FollowModel to retrieve all followers following this user
     * @param {string} uid User's primary key
     * @returns Promise to be notified when the follows are retrieve from database
     */
    findAllUsersFollowingThisUser = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({following: uid})
            .populate({
                path:"following",
                populate: {
                    path: "user"
                }})
            .exec();

    /**
     * FollowModel to retrieve the users this user is following
     * @param {string} uid User's primary key
     * @returns Promise to be notified when the follows are retrieve from database
     */
    findAllUsersThisUserFollows = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({user: uid})
            .populate({
                path: "following",
                select: "username"
            })
            .exec();

    /**
     * FollowModel to retrieve one instance of a follow giving a particular user and another user
     * @param {string} uid User's primary key
     * @param {string} follow Tuit's primary key
     */
    findOneFollow = async (uid: string, follow: string): Promise<any> =>
        FollowModel.findOne({user: uid, following: follow})
            .populate({
                path: "user",
                populate : {
                    path: "username"
                }
            })
            .exec();

}

