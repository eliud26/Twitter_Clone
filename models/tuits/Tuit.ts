import User from "../users/User";
import Stats from "./Stats";

export default class Tuit {
    private tuit: string = '';
    private postedBy: User | null = null;
    private postedOn: Date = new Date();
    private avatarLogo: string = '';
};