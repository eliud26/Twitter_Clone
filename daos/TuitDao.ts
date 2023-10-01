/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TuitModel from "../mongoose/tuits/TuitModel";
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * @class TuitDao Implements Data Access Object managing data storage
 * of Users
 * @property {TuitDao} tuitDao Private single instance of UserDao
 */
export default class TuitDao implements TuitDaoI{
    public static tuitDao: TuitDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns TuitDao
     */
    public static getInstance = (): TuitDao => {
        if(TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    public constructor() {}

    /**
     * Uses TuitModel to retrieve all the tuits
     * @return Promise To be notified when tuits are retrieved from the database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find()
            .populate("postedBy")
            .exec();

    /**
     * Uses TuitModel to retrieve all tuits by a given user
     * @param {string} uid User's primary key
     * @returns Promise To be notified when tuits are retrieved from the database
     */
    findAllTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({postedBy: uid})
            .sort({'postedOn': -1})
            .populate("postedBy")
            .exec();

    /**
     * Uses TuitModel to retrieve all tuits by the ID
     * @param {string} uid User's primary key
     * @returns Promise To be notified when tuits are retrieved from the database
     */
    findTuitById = async (uid: string): Promise<any> =>
        TuitModel.findById(uid)
            .populate("postedBy")
            .exec();

    /**
     * Create a tuit by user ID
     * @param uid user primary key
     * @param tuit the tuit to be posted
     * @return Promise To be notified when the tuit is posted
     * to the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({...tuit, postedBy: uid});

    /**
     * Update a tuit
     * @param uid user primary key
     * @param tuit the updated tuit
     * @return Promise To be notified when the tuit is updated
     * in the database
     */
    updateTuit = async (uid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            {_id: uid},
            {$set: tuit});

    /**
     * Delete a tuit from database
     * @param uid id of the tuit
     * @return Promise To be notified when tuit is removed from
     * the database
     */
    deleteTuit = async (uid: string): Promise<any> =>
        TuitModel.deleteOne({_id: uid});

    /**
     * Updates the stats nested schema for a particular tuit
     * @param {string} tid Primary key of tuit to be modified
     * @param {any} newStats Nested schema representing tuits stats
     * @returns {Promise} To be notified when tuit is updated in the database
     */
    public updateLikes = async (tid: string, newStats: any): Promise<any> =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: {stats: newStats}}
        );

    public deleteTuitByContent = async (tuit: string): Promise<any> =>
        TuitModel.deleteMany({tuit:tuit});
}
    updateLikes = async (tid: string, newStats: Tuit): Promise<any> =>
        TuitModel.updateOne({_id: tid}, {$set: {stats: newStats}});

}
