import express from "express";
import {
    newPublication,
    allPublications,
    deletePublication,
    getPublicationsByTeam,
    getPublicationById,
    createComment,
    getCommentsByPost,
    deleteComment,
    likePost,
    deleteLikePost,
    getPublicationsByUser,
    searchPublication
} from "../controller/postcontroller.js";

const router = express.Router();

router.get("/traer/team/:team", getPublicationsByTeam);
router.get("/traer", allPublications);
router.get("/traer/:id", getPublicationById);
router.get("/user/:userId", getPublicationsByUser);
router.get("/search", searchPublication);
router.post("/crear", newPublication);
router.delete("/:id", deletePublication);

router.get("/comments/:postId", getCommentsByPost)
router.post("/comments/:postId", createComment)
router.delete("/comments/:postId/:commentId", deleteComment)

router.post("/likes/:postId", likePost)
router.delete("/likes/:postId/:userId", deleteLikePost)

export default router;
