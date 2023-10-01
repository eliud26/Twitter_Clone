/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
import express, {Request, Response} from 'express';
import CourseController from "./controllers/CourseController";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import LikeController from "./controllers/LikeController";
import ImageDao from './daos/ImageDao';
import ImageController from "./controllers/ImageController";
import mongoose from "mongoose";
import FollowDao from "./daos/FollowDao";
import FollowController from "./controllers/FollowController";
import AuthenticationController from "./controllers/AuthenticationController";
import DisLikeDao from "./daos/DislikeDao";
import LikeDao from "./daos/LikeDao";
import TuitDao from "./daos/TuitDao";
import MessageDao from "./daos/MessageDao";
import MessageController from "./controllers/MessageController";
import BookmarkController from "./controllers/BookmarkController";
import BookmarkDao from "./daos/BookmarkDao";
const cors = require('cors')
const session = require("express-session");

// build the connection string

const PROTOCOL = "mongodb+srv";
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const HOST = "cluster0.exbec.mongodb.net";
const DB_NAME = "myFirstDatabase";
const DB_QUERY = "retryWrites=true&w=majority";
const connectionString = `${PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${HOST}/${DB_NAME}?${DB_QUERY}`;
const connection = "mongodb+srv://software-engineering:softwareSpring2022@cluster0.exbec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


// connect to the database
mongoose.connect(connection);

// mongoose.connect('mongodb+srv://PPK2000:Poorna-2000@cluster0.1murc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect('mongodb://localhost:27017/Tuiter');


//express instance
const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
const SECRET = 'process.env.SECRET';
let sess = {
    secret: SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        secure: process.env.NODE_ENV === "production",
    }
}
if(process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}
app.use(session(sess))
app.use(express.json());

app.get('/', (req: Request, res: Response) =>
    res.send('Welcome!'));

app.get('/add/:a/:b', (req: Request, res: Response) =>
    res.send(req.params.a + req.params.b));

// create RESTful Web service API
const courseController = new CourseController(app);
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const dislikesDao = new DisLikeDao();
const likeDao = new LikeDao();
const bookmarkDao = new BookmarkDao();
const bookmarkController = new BookmarkController(app,bookmarkDao);
const imageDao = new ImageDao();
const followDao = new FollowDao();
const tuitDao = TuitDao.getInstance();
const messageDo = new MessageDao();
const followController = new FollowController(app, followDao);
const imageController = new ImageController(app, imageDao, followDao);
const likeController = new LikeController(app, likeDao, tuitDao, dislikesDao);
const messageController = new MessageController(app, messageDo, followDao);
AuthenticationController(app);


/**clear
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);