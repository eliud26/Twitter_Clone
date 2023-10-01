import Tuit from "../../models/tuits/Tuit";
import User from "../../models/users/User";

export default interface DisLike {
    tuit: Tuit,
    dislikedBy: User
};