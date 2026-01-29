const { Router } = require("express");
import { 
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from("../controllers/tweet.controller.js")
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
route.use(verifyJWT)

router.route("/").post(createTweet)
router.route("/:userId").ger(getUserTweets)
router.route("/update/:tweetId").patch(updateTweet)
router.route("/:tweetId").delete(deleteTweet)

export default router