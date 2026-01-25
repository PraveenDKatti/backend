import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";


export const verifyCommentOwner = asyncHandler( async (req,res,next) => {
    const { commentId } = req.params

    if(!commentId){
        throw new ApiError(404,"comment not found")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "comment does'nt exist")
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "dont have privilage to access the comment")
    }

    req.comment = comment
    next()
})