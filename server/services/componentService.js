import { connection, logger } from "../index.js";
import { parseRowDataPacket } from "./parsingService.js";


export const addComponentService = async (component) => {
  try{
    const {
      c_id, 
      c_name, 
      c_desc, 
      testlead_id,
      c_status,
      project_id,
    } = component;


    let componentUpdateQuery = `UPDATE Component SET
        c_name = '${c_name}',
        c_desc = '${c_desc}',
        c_status = '${c_status}',
        project_id = '${project_id}',
        testlead_id = '${testlead_id}'
        WHERE c_id = ${c_id};
    `;
    let componentAddQuery = `INSERT INTO Component (
        c_id,
        c_name,
        c_desc,
        c_status,
        project_id,
        testlead_id) VALUES (${null}, '${c_name}', '${c_desc}', '${c_status}',${project_id},${testlead_id})
    `;

    if(c_id){ //update
    let getComponentByIdQuery = `SELECT * FROM Component WHERE c_id = ${c_id};`;
      const response = await connection.query(componentUpdateQuery);
      const insertedObject = await connection.query(getComponentByIdQuery);
      const result = parseRowDataPacket(insertedObject);
      logger.info('Component Added', result.c_id);

      return {
        success: true,
        data: result[0]
      };
    }
    else{ //add

      //Need to check if the testlead_id, actually belongs to a test lead or NOT...
      const response = await connection.query(componentAddQuery);
      let getComponentByIdQuery = `SELECT * FROM Component WHERE c_id = ${response.insertId};`;
      const insertedObject = await connection.query(getComponentByIdQuery);
      const result = parseRowDataPacket(insertedObject);
      logger.info('Component Updated', result.c_id);

      return {
        success: true,
        data: result[0]
      };
    }
  }
  catch(e){
    console.log(e);
    return {
      success: false,
      message:  e.message
    }
  }
}

export const getComponentBasedOnIdService = async (c_id) =>{ 
  const getComponentBasedOnId = `SELECT * FROM Component WHERE c_id = ${c_id}`;
  try{
    const response = await  connection.query(getComponentBasedOnId);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Components Fetched');

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

export const getComponentsBasedOnTestLeadService = async (testlead_id) => {
  console.log(testlead_id);
  const getComponentsBasedOnTestLead=  `SELECT * FROM Component WHERE testlead_id = ${testlead_id}`;
  const getUserBasedOnId = `SELECT * FROM User WHERE e_id = ${testlead_id}`;

  try{
      // const userResponse = await connection.query(getUserBasedOnId);
      // const users = parseRowDataPacket(userResponse);
      const response = await connection.query(getComponentsBasedOnTestLead); 
      const parsedResponse = parseRowDataPacket(response);
      logger.info('Component Fetched');

      console.log(parsedResponse);
      return {
        success: true,
        data: parsedResponse
      }
  }
  catch(err){
    return {
      success: false,
      message: err.message
    }
  }
}

export const getTotalComponentCountService = async() => {
  const getTotalComponentCountQuery = 'SELECT COUNT(*) AS COUNT FROM Component';
  try{
    const response = await connection.query(getTotalComponentCountQuery);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Components Count Fetched', parsedResponse);

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

