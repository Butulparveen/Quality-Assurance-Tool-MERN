//SJSU CMPE 138 Spring 2022 TEAM3 

import express from "express";
import { addComponent, getComponentsBasedOnProject, getComponentsBasedOnTestLead, getTotalComponentCount, getComponentBasedOnId } from "../controllers/componentController.js";
const router = express.Router();

router.post('/new', addComponent);
router.get('/project/:project_id', getComponentsBasedOnProject);
router.get('/test_lead/:testlead_id', getComponentsBasedOnTestLead);
router.get('/count', getTotalComponentCount);
router.get('/details/:c_id', getComponentBasedOnId);


export default router;