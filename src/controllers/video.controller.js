import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    
    //list query terms
    const {
        query = "",
        sort = "desc",
        page = 1,
        limit = 10,
    } = req.query

    //convert query strings into Number
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skipNumber = (pageNumber - 1) * limitNumber

    //construct search query
    const searchTerm = query ? {title:{ $regex:query, $options:'i'}} : {}

    //created time options for sort
    const createdTime = {
        createdAt : sort === "desc" ? -1 : 1 
    }

    const video = await Video
    .find(searchTerm)
    .sort(createdTime)
    .skip(skipNumber)
    .limit(limitNumber)

    return res
    .status(200)
    .json(new ApiResponse(200, video, `search results for '${query}'`))

})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    const { title, description } = req.body

    if ([title, description].some(field => field.trim() === "")) {
        throw new ApiError(401, "all fields required")
    }

    const videoPath = req.files?.videoFile[0]?.path
    if (!videoPath) {
        throw new ApiError(401, "Video is required")
    }
    const thumbnailPath = req.files?.thumbnail[0]?.path

    const cloudVideoFile = await uploadOnCloudinary(videoPath, { resource_type:"video"})
    const cloudThumbnail = await uploadOnCloudinary(thumbnailPath, {resource_type: "image"})

    if(!cloudVideoFile){
        throw new ApiError(500, "something went wrong while uploading video")
    }

    const videoDuration = cloudVideoFile.duration

    const video = await Video.create({
        videoFile: cloudVideoFile.url,
        title,
        description,
        duration: videoDuration,
        thumbnail:cloudThumbnail.url,
        owner:req.user?._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video published successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id]]
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400, "video id is required")
    }

    const video = await Video.findById(videoId)

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail

    const video = req.video

    const {
        title:newTitle = "",
        description: newDescription =""
    } = req.body

    const thumbnailPath = req.file?.path

    if(!(newTitle || newDescription || thumbnailPath)){
        throw new ApiError(401,"missing video details")
    }

    let newThumbnail = "";

    if(thumbnailPath){
        newThumbnail = await uploadOnCloudinary(thumbnailPath)

        if(!newThumbnail.url){
            throw new ApiError(500,"Something went wrong while uploading thumbnail")
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        video._id,
        {
            $set: {
                title: newTitle ? newTitle : video.title,
                description: newDescription ? newDescription : video.description,
                thumbnail: newThumbnail ? newThumbnail : video.thumbnail
            }
        },
        {new:true}
    ).select("-password -refreshToken")

    console.log(updatedVideo)

    return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const video = req.video

    await Video.deleteOne(video._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "deleted video successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}