import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"
import verifyPlaylistOwner from "../middlewares/verifyPlaylistOwner.middleware.js"

const { Router } = require("express");


const router = Router()

router.route("/create").post(verifyJWT, createPlaylist)
router.route("/getAll").get(verifyJWT, getUserPlaylists)
router.route("/:playlistId").get(verifyJWT, getPlaylistById)
router.route("/:playlistId/add").patch(verifyJWT, verifyPlaylistOwner, addVideoToPlaylist)
router.route("/:playlistId/remove").patch(verifyJWT, verifyPlaylistOwner, removeVideoFromPlaylist)
router.route("/:playlist/delete").delete(verifyJWT, verifyPlaylistOwner, deletePlaylist)
router.route("/:playlist/update").patch(verifyJWT, verifyPlaylistOwner, updatePlaylist)

export default router