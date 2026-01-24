import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyOwner } from "../middlewares/verifyOwner.middleware.js"

const router = Router()

router.route("/publish-video").post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]), verifyJWT, publishAVideo
)

router.route("/search").get(getAllVideos)
router.route("/video/:videoId").get(getVideoById)
router.route("/v/:videoId").patch(verifyJWT, verifyOwner, upload.single("thumbnail"), updateVideo)

export default router