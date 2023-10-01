import mongoose, {Schema} from "mongoose";
import Tuit from "../../models/tuits/Tuit";
const TuitSchema = new mongoose.Schema<Tuit>({
    tuit: {type: String, required: true},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
    postedOn: {type: Date, default: Date.now},
    avatarLogo: {type: String, default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw3Btl7TMH928lOF0b3qeF1q&ust=1648918383421000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPDi-OWp8_YCFQAAAAAdAAAAABAD'},
    stats: {
        replies: Number,
        retuits: Number,
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        likeByFlag: Boolean,
        dislikeByFlag: Boolean
    }
}, {collection: "tuits"});
export default TuitSchema;