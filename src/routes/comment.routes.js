import { Router } from "express";
import { getVideoComments } from "../controllers/comment.controller.js";

const router = Router()

router.route("/get-comment/:videoId").get(getVideoComments)


export default router