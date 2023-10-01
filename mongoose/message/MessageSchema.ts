import mongoose, {Schema} from "mongoose";
import Message from "../../models/message/Message"
import moment from "moment";

const MessageSchema = new mongoose.Schema<Message>({
    message: {type: String, required: true, ref: String},
    sender: {type: Schema.Types.ObjectId, ref: "UserModel"},
    receiver: {type: Schema.Types.ObjectId, ref: "UserModel"},
    sentOn: {type: String, default: function() {
        return moment().format("YYYY-MM-DD hh:mm:ss")
        }
    },
}, {collection: "message"})
export default MessageSchema;