import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verifyLikeOwner } from "../middlewares/verifyLikeOwner.middleware.js"

const router = Router()

router.route("/:likeId").get(verifyJWT, getLikedVideos)
router.route("/:likeId").delete(verifyJWT, verifyLikeOwner, toggleCommentLike)
router.route("/:likeId").delete(verifyJWT, verifyLikeOwner, toggleVideoLike)
router.route("/:likeId").delete(verifyJWT, verifyLikeOwner, toggleTweetLike)

export default router