import { Router } from "express";
import { 
    addVideoToPlaylist, 
    createPlaylist, 
    deletePlaylist, 
    getPlaylistById, 
    getUserPlaylists, 
    removeVideoFromPlaylist, 
    updatePlaylist 
} from "../controllers/playlist.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"


const router = Router()
router.use(verifyJWT)

router.route("/create").post(createPlaylist)
router.route("/user/:userId").get(getUserPlaylists)
router.route("/:playlistId").get(getPlaylistById)
router.route("/add/:playlistId/").patch(addVideoToPlaylist)
router.route("/remove/:playlistId/").patch(removeVideoFromPlaylist)
router.route("/:playlistId").delete(deletePlaylist)
router.route("/update/:playlist").patch(updatePlaylist)

export default router