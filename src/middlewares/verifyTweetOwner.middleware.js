import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyTweetOwner = asyncHandler( async(req,res,next) => {
    const tweetId = req.params

    if(!tweetId) throw new ApiError(404, "tweet id is required")

    const tweet = await Tweets.findById(tweetId)

    if(!tweet) throw new ApiError(401, "tweet is missing")
    
    if(tweet.owner.toString() !== req.user._id){
        throw new ApiError(403, "not authorized to modify tweet")
    }

    req.tweet = tweet
    next()
})

export { verifyTweetOwner }