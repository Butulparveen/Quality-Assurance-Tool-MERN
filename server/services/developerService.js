//SJSU CMPE 138 Spring 2022 TEAM3 

import { connection } from "../index.js";
import { parseRowDataPacket } from "./parsingService.js";

export const insertDeveloper = async (developer_id) => {
    const testerAddQuery = `INSERT INTO developer (developer_id, no_of_bugs_resolved) VALUES (${developer_id}, ${0})`;
    const result = await connection.query(testerAddQuery);
    const parsedResult = parseRowDataPacket(result);
    return parsedResult;
}


export const getDeveloperListService = async () =>{
    const getDeveloperListQuery = `SELECT * FROM User WHERE type= 'developer'`;
  try {
    const result = parseRowDataPacket(await connection.query(getDeveloperListQuery));
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

//Need to update the number of bug resolved....
