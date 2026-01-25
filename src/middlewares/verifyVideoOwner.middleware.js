import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

export const verifyVideoOwner = asyncHandler(async (req, res, next) => {

    const { videoId } = req.params
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not Found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you dont have the privilages to edit the video")
    }

    req.video = video;
    next()

})
