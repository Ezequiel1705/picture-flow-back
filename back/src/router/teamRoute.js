import { getTeams, postTeam, updateTeam } from '../controller/teamcontroller.js';
import express from 'express';

const router = express.Router();

router.get("/", getTeams);
router.post("/", postTeam);
router.put("/:id", updateTeam);

export default router;