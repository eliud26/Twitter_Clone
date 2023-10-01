import Follow from "../models/follow/Follow"

/**
 * @file declares API for Follow related data access object methods.
 */
export default interface FollowDao {
    createFollow(uid: string, follow: string): Promise<any>;
    deleteFollow(uid: string, follow: string): Promise<any>;
    findAllUsersFollowingThisUser(uid: string): Promise<Follow[]>;
    findAllUsersThisUserFollows(uid: string): Promise<Follow[]>;
    findOneFollow(uid: string, follow: string): Promise<Follow>;
    findAllFollow(): Promise<Follow[]>;
}