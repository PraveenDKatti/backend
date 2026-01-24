import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

export const verifyOwner = asyncHandler(async(req,res,next) => {

    try {
        const { videoId } = req.params
        const video = await Video.findById(videoId)

        if(!video){
            throw new ApiError(404, "Video not Found")
        }
    
        if(video.owner.toString() !== req.user._id.toString()){
            throw new ApiError("401", "Unauthorized access")
        }
        
        req.video = video;
        next()
        
    } catch (error) {
        throw new ApiError(401,error?.message || "Incorrect video details")
    }

})
