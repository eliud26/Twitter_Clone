import User from "../users/User";

export default interface Image {
    sender: User,
    receiver: User,
    image: string
    sentOn?: Date
}