import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../utils"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    //TODO: create playlist

    if (!(name || description)) {
        throw new ApiError(404, "name and description required")
    }

    const playlist = await Playlist.create({
        name: name,
        description: description,
        owner: req.user,
        videos: []
    })

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const playlist = await Playlist.aggregate([
        {
            $match: {
                owner: req.user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "owner",
                as: "playlist",
            }
        }
    ])

    if (!playlist) {
        throw new ApiError(404, "No playlist found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id

    const playlist = req.playlist

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist fetched successfully"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = req.playlist

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    playlist.videos.addToSet(videoId)
    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "video added to playlist"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    const playlist = req.playlist

    playlist.videos.pull(videoId)

    if (!Playlist) {
        throw new ApiError(401, "something went wrong")
    }

    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "removed video from playlist"))


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    await Playlist.deleteOne(playlistId)

    return res
        .status(200)
        .jsoon(new ApiResponse(200, {}, "playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name = "", description = "" } = req.body
    //TODO: update playlist

    const playlist = req.playlist

    if (name) {
        playlist.name = name
    }

    playlist.description = description
    if (description) {
        playlist.description = description
    }

    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "updated playlist successfully."))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
