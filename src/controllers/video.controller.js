import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination

    const pipeline = []

    //convert query strings into Number
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skipNumber = (pageNumber - 1) * limitNumber

    //construct search query
    if(query){
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        })
    }

    // Sort logic
    if (sortBy && sortType) {
        pipeline.push({
            $sort: { [sortBy]: sortType === "asc" ? 1 : -1 }
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Fetch owner details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }]
        }
    }, { $addFields: { owner: { $first: "$owner" } } });

    const aggregate = Video.aggregate(pipeline);
    
    // Using mongoose-aggregate-paginate-v2
    const options = { page: pageNumber, limit: limitNumber, skip: skipNumber };
    const videos = await Video.aggregatePaginate(aggregate, options);

    return res
    .status(200)
    .json(new ApiResponse(200, videos, `search results for '${query}'`))

})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    const { title, description } = req.body

    if ([title, description].some(field => field.trim() === "")) {
        throw new ApiError(401, "all fields required")
    }

    const videoPath = req.files?.videoFile[0]?.path
    const thumbnailPath = req.files?.thumbnail[0]?.path

    if (!videoPath) throw new ApiError(400, "Video is required")
    if (!thumbnailPath) throw new ApiError(400, "Thumbnail is required")

    const cloudVideoFile = await uploadOnCloudinary(videoPath, { resource_type:"video"})
    const cloudThumbnail = await uploadOnCloudinary(thumbnailPath, {resource_type: "image"})

    if(!cloudVideoFile){
        throw new ApiError(500, "something went wrong while uploading video")
    }

    const video = await Video.create({
        videoFile: cloudVideoFile.url,
        title,
        description,
        duration: cloudVideoFile.duration,
        thumbnail:cloudThumbnail.url,
        owner:req.user?._id,
        isPublished,
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
    if(!video){
        throw new ApiError(404, "video does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail

    const video = req.video

    const {
        title = "",
        description = "",
    } = req.body

    const thumbnailPath = req.file?.path

    if(!(title || description || thumbnailPath)){
        throw new ApiError(401,"missing video details")
    }
                
    if(title){
        video.title = title
    }
    
    if(description){
        video.description = description
    }
    
    if(thumbnailPath){
        newThumbnail = await uploadOnCloudinary(thumbnailPath)

        if(!newThumbnail.url){
            throw new ApiError(500,"Something went wrong while uploading thumbnail")
        }
        video.thumbnail = newThumbnail.url
    }

    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"))

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
    const video = req.video

    video.isPublished = !video.isPublished
    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(200, video, "toggled publish status Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
