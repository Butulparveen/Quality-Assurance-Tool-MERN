//SJSU CMPE 138 Spring 2022 TEAM3 

import express from "express";
import { addProject, getProjectBasedOnId, getProjectsBasedOnManager, getTotalProjectCount } from "../controllers/projectController.js";
const router = express.Router();

router.post('/new', addProject);
router.get('/manager/:manager_id', getProjectsBasedOnManager);
router.get('/details/:p_id', getProjectBasedOnId);
router.get('/count', getTotalProjectCount);



export default router;


