import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { togglePublishStatus, deleteVideo, getAllVideos, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyVideoOwner } from "../middlewares/verifyVideoOwner.middleware.js"

const router = Router()

router.route("/publish").post(
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
router.route("/:videoId").get(getVideoById)
router.route("/update/:videoId").patch(verifyJWT, verifyVideoOwner, upload.single("thumbnail"), updateVideo)
router.route("/delete/:videoId").delete(verifyJWT, verifyVideoOwner, deleteVideo)
router.route("/toggle/publish/:videoId").patch(verifyJWT, verifyVideoOwner, togglePublishStatus)

export default router