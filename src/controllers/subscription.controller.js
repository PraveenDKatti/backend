import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    if (!channelId) {
        throw new ApiError(401, "channel id required")
    }

    const subscription = await Subscription.findById(channelId)

    if (!subscription) {
        throw new ApiError(404, "Subscriber not found")
    }

    if (subscription._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you dont have privilage to toggle subscription")
    }

    await Subscription.deleteOne(channelId)

    return res
        .status(200)
        .json(200, {}, "subscription toggled successfully")
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const channelSubscribers = await Subscription.aggregate([
        {
            $match: {
                _id: channelId
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "channelId",
                as: "channel",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "subscriber",
                            foreignField: "_id",
                            as: "subscriber"
                        }
                    }
                ]
            }
        },
        {    
            $project: {
                fullName: 1,
                avatar: 1,
                coverImage: 1
            }
        }
    ])

    if (!channelSubscribers) {
        throw new ApiError(404, "Channel doesn't exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channelSubscribers, "subscribers fetched successfully."))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const subscribedChannels = await Subscription.aggregate([
        {
            $match:{
                subscriber: subscriberId
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "_id",
                foreignField: "channel",
                as: "channel",
                pipeline:[
                    {
                        $lookup:{
                            from: "subsriptions",
                            localField: "channel",
                            foreignField: "subscriber",
                            as: "subscriber"
                        }
                    }
                ]
            }
        },
        {
            $project:{
                fullName: 1,
                avatar: 1,
                coverImag: 1        
            }
        }
    ])

    if(!subscribedChannels){
        throw new ApiError(404, "No subscribers")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "fetched user subscribed channels successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}