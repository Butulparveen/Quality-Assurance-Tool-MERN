//SJSU CMPE 138 Spring 2022 TEAM3 

import express from 'express';
import { addBug, getBugBasedOnDeveloper } from '../controllers/bugController.js';

const router = express.Router();
router.post('/new', addBug);
router.get('/bug_list/developer/:developer_id', getBugBasedOnDeveloper);


export default router;