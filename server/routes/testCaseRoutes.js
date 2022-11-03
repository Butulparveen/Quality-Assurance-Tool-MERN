//SJSU CMPE 138 Spring 2022 TEAM3 

import express from "express";
import { addTestCase, getTestCasesBasedOnComponent, getTestCasesBasedOnTester, getTotalTestCaseCount, getTestCaseBasedOnId } from "../controllers/testCaseController.js";

const router = express.Router();

router.post('/new', addTestCase);
router.get('/count', getTotalTestCaseCount);
router.get('/tester/:tester_id', getTestCasesBasedOnTester);
router.get('/component/:component_id', getTestCasesBasedOnComponent);
router.get('/details/:tc_id', getTestCaseBasedOnId);

export default router;