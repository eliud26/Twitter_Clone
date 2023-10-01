import mongoose, {Schema} from "mongoose";
import Follow from "../../models/follow/Follow";
const FollowSchema = new mongoose.Schema<Follow>({
    user: {type: Schema.Types.ObjectId, ref: "UserModel"},
    following: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "follow"});
export default FollowSchema;