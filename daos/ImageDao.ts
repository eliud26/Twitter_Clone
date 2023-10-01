/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose MessageDao
 * to integrate with MongoDB
 */
import ImageDaoI from "../interfaces/imageDao";
import ImageModel from "../mongoose/image/ImageModel";
import Image from "../models/image/Image";

/**
 * @class ImageDao Implements Data Access Object managing data storage
 * of Images
 * @property {ImageDao} ImageDao Private single instance of MessageDao
 */
export default class ImageDao implements ImageDaoI {
    /**
     * Uses ImageModel to insert new values in the images collection
     * @returns Promise To be notified when the image is inserted in the
     * database
     */
    createImage = async (uid: string, ruid: string, image: string): Promise<Image> =>
        ImageModel.create({sender: uid, receiver: ruid, image: image});

    /**
     * ImageModel to remove a Image instance from the database.
     * @param {string} uid Primary key of user that sent image
     * @param {string} ruid Primary key of the receiver's image to be removed
     * @param {string} iid Primary key of the image itself
     * @returns Promise To be notified when image instance is removed from the database
     */
    deleteImage =  async (uid: string, ruid: string, iid: string): Promise<any> =>
        ImageModel.deleteOne({sender: uid, receiver: ruid, _id: iid});

    /**
     * ImageModel to retrieve all Images sent by this user
     * @param {string} uid User's primary key
     * @param {ruid} ruid the Receiver's primary key
     * @returns Promise to be notified when the images are retrieve from database
     */
    findImagesByUser = async (uid: string, ruid: string): Promise<Image[]> => {
        return ImageModel.find({sender: ruid, receiver: uid})
            .sort({'postedOn': -1})
            .populate({
                path: "sender",
                select: "username"
            })
            .exec();
    }

    /**
     * ImageModel to retrieve all messages sent to this user
     * @param {string} uid User's primary key
     * @param {ruid} ruid the Receiver's primary key
     * @returns Promise to be notified when the images are retrieve from database
     */
    findImagesToUser = async (uid: string, ruid: string): Promise<Image[]> => {
        return ImageModel.find({receiver: ruid, sender: uid})
            .sort({'postedOn': -1})
            .populate({
                path: "receiver",
                select: "username"
            })
            .exec();
    }

    /**
     * ImageModel to retrieve all Images stored in the message collection
     * @returns Promise to be notified when the follows are retrieve from database
     */
    findAllImages = async (): Promise<Image[]> =>
        ImageModel.find()
            .populate("sender")
            .populate("receiver")
            .exec();

}

