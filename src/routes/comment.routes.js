import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { verifyCommentOwner } from "../middlewares/verifyCommentOwner.middleware.js"

const router = Router()

router.route("/:videoId/comments").get(getVideoComments)
router.route("/:videoId/comments").post(verifyJWT, addComment)
router.route("/c/:commentId").patch(verifyJWT, verifyCommentOwner, updateComment)
router.route("/c/:commentId").delete(verifyJWT, verifyCommentOwner, deleteComment)


export default router