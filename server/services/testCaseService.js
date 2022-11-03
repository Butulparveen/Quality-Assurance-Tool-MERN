//SJSU CMPE 138 Spring 2022 TEAM3 

import moment from 'moment';
import { connection, logger } from '../index.js';
import { parseRowDataPacket } from './parsingService.js';


export const addTestCaseService = async (testCase) => {
  try {
    const {
      tc_id,
      tc_name,
      tc_desc,
      tc_status,
      mode_of_execution,
      component_id,
      tester_id,
    } = testCase;
    let getTestCaseByIdQuery = `SELECT * FROM TestCase WHERE tc_id = ${tc_id};`;
    const created_at = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');
    //console.log(testCase, created_at);

    let testCaseUpdateQuery = `UPDATE TestCase SET
        tc_name = '${tc_name}',
        tc_desc = '${tc_desc}',
        tc_status = '${tc_status}',
        mode_of_execution = '${mode_of_execution}',
        component_id = ${component_id},
        tester_id = ${tester_id}
        WHERE tc_id = ${tc_id};
    `;
    let testCaseAddQuery = `INSERT INTO TestCase (
        tc_id,
        tc_name,
        tc_desc,
        tc_status,
        mode_of_execution,
        component_id,
        created_at,
        tester_id) VALUES (${null}, '${tc_name}', '${tc_desc}','${tc_status}','${mode_of_execution}',${component_id},
        '${created_at}', ${tester_id})
    `;
    if (tc_id) { //Update
      let completed_at;
      if (tc_status === 'Passed' || tc_status === 'Failed') {
        completed_at = moment(new Date()).format('YYYY-MM-DD HH:MM:SS'); //There is a shitty bug here...
        testCaseUpdateQuery = `UPDATE TestCase SET
          tc_name = '${tc_name}',
          tc_desc = '${tc_desc}',
          tc_status = '${tc_status}',
          mode_of_execution = '${mode_of_execution}',
          component_id = ${component_id},
          tester_id = ${tester_id},
          completed_at = '${completed_at}'
          WHERE tc_id = ${tc_id};
        `;
      }
      const response = await connection.query(testCaseUpdateQuery);
      const insertedObject = await connection.query(getTestCaseByIdQuery);
      const result = parseRowDataPacket(insertedObject);
      logger.info('Test Case Updated', result.tc_id);
      return {
        success: true,
        data: result[0]
      };
    }
    else { //Add New
      const response = await connection.query(testCaseAddQuery);
      getTestCaseByIdQuery = `SELECT * FROM TestCase WHERE tc_id = ${response.insertId};`;
      const insertedObject = await connection.query(getTestCaseByIdQuery);
      const result = parseRowDataPacket(insertedObject);
      logger.info('Test Case Added', result.tc_id);

      return {
        success: true,
        data: result[0]
      };
    }
  }
  catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message
    }
  }
}

export const getTestCasesBasedOnComponentService = async (component_id) => {
  const getTestCasesBasedOnComponentQuery = `SELECT * FROM TestCase WHERE component_id = ${component_id}`;
  try {
    const result = parseRowDataPacket(await connection.query(getTestCasesBasedOnComponentQuery));
    logger.info('Test Cases Fetched');

    return {
      success: true,
      data: result,
    }
  }
  catch (e) {
    console.log(e);
    return {
      success: false,
      message: e
    }
  }
}

export const getTestCasesBasedOnTesterService = async (tester_id) => {
  const getTestCasesBasedOnTesterQuery = `SELECT * FROM TestCase WHERE tester_id = ${tester_id}`;
  try {
    const result = parseRowDataPacket(await connection.query(getTestCasesBasedOnTesterQuery));
    logger.info('Test Cases Fetched');

    return {
      success: true,
      data: result,
    }
  }
  catch (e) {
    console.log(e);
    return {
      success: false,
      message: e
    }
  }
}

export const getTestCaseBasedOnIdService = async (tc_id) =>{ 
  const getTestCaseBasedOnId = `SELECT * FROM TestCase WHERE tc_id = ${tc_id}`;
  try{
    const response = await  connection.query(getTestCaseBasedOnId);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Test Case Fetched', parsedResponse);

    return{
      success: true,
      data: parsedResponse
    }
  }
  catch(e){
    console.log(e);
    return{
      success: false,
      message: e.message
    }
  }
}


export const getTotalTestCaseCountService = async () => {
  const getTotalTestCaseCountQuery = 'SELECT COUNT(*) AS COUNT FROM TestCase';
  try {
    const response = await connection.query(getTotalTestCaseCountQuery);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Test Cases Count Fetched', response);

    return {
      success: true,
      data: parsedResponse
    }
  }
  catch (e) {
    console.log(e);
    return {
      success: false,
      message: e.message
    }
  }
}