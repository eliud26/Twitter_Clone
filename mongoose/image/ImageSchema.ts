import mongoose, {Schema} from "mongoose";
import Image from "../../models/image/Image";
import moment from "moment";

const ImageSchema = new mongoose.Schema<Image>({
    sender: {type: Schema.Types.ObjectId, ref: "UserModel"},
    receiver: {type: Schema.Types.ObjectId, ref: "UserModel"},
    image: {type: String},
    sentOn: {type: String, default: function () {
            return moment().format("YYYY-MM-DD hh:mm:ss")
        }
    }
}, {collection: "images"})
export default ImageSchema;
