import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video

    const { videoId } = req.params
    const { page=1,limit=10 } = req.query

    if(!videoId){
        throw new ApiError(404, "video not found")
    }

    const video = await Video.findById(videoId)

    if(!video){
        await Comment.deleteMany({video:videoId})
        throw new ApiError(404, "video doesn't exist")
    }

    //construct comment page and limit
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skipLength = (pageNumber-page)*limitNumber

    const commentList = await Comment.find({video:videoId}).skip(skipLength)

    return res
    .status(200)
    .json(new ApiResponse(200, commentList, "comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content="" } = req.body
    const { videoId } = req.params

    if(!content){
        throw new ApiError(404, "comment not found")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "video not found")
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user._id,
    })

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { content } = req.body

    if(!content){
        throw new ApiError(404, "content is required")
    }

    const comment = req.comment

    comment.content = content
    await comment.save()

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const comment = req.comment
    await Comment.deleteOne(comment._id)

    return res
    .status(200)
    .json(new ApiResponse(200, "comment deleted Successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
