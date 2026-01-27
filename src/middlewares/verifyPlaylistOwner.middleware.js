import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";



const verifyPlaylistOwner = asyncHandler( async(req, res, next) => {
    const { playllistId } = req.params
    if(!playllistId){
        throw new ApiError(401, "playlist is required")
    }

    const playlist = await Playlist.findById(playllistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized access")
    }

    req.playlist = playlist
    next()
} )

export { verifyPlaylistOwner }