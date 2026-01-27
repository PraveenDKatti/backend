import { Like } from "../models/like.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";


const verifyLikeOwner = asyncHandler( async(req,res,next) => {
    const likeId = req.params
    if(!likeId) throw new ApiError(404,"missing details")

    const like = await Like.findById(likeId)

    if(!like){
        throw new ApiError(401, "something went wrong")
    }

    if(like.likedBy.toString() !== req.user._id.toString()){
        throw new ApiError(403, "you dont have privilages")
    }

    req.like = like
    next()

})

export { verifyLikeOwner }