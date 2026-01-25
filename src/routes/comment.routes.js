import { Router } from "express";
import { addComment, getVideoComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/get-comment/:videoId").get(getVideoComments)
router.route("/add-comment/:videoId").post(verifyJWT, addComment)


export default router