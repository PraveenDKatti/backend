const { Router } = require("express");
import { createTweet } from("../controllers/tweet.controller.js")

const router = Router()

router.route("/").post(verifyJWT, createTweet)
router.route("/").ger(verifyJWT, createTweet)
router.route("/:tweetId").patch(verifyJWT, createTweet)
router.route("/:tweetId/delete").delete(verifyJWT, createTweet)

export default router