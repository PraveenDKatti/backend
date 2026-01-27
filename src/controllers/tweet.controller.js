import mongoose, { isValidObjectId } from "mongoose"
import {Community} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body

    if(!content) throw new ApiError("content is required.")

    const tweet = await Community.create({
        content: content,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const tweets = req.tweet

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "tweets fetched successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { content } = req.body

    if(!content) throw new ApiError(404, "content is required")

    const tweet = req.tweet

    tweet.content = content
    await content.save()

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweet = req.tweet

    await Tweet.deletOne(tweet._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
