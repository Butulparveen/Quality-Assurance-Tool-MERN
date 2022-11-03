//SJSU CMPE 138 Spring 2022 TEAM3 

import { connection, logger } from "../index.js";
import { parseRowDataPacket } from "./parsingService.js";

export const addProjectService = async (project) => {
  try{
    const {
      p_id, 
      p_name, 
      p_desc, 
      manager_id,
    } = project;


    let projectUpdateQuery = `UPDATE Project SET
        p_name = '${p_name}',
        p_desc = '${p_desc}',
        manager_id = '${manager_id}'
        WHERE p_id = ${p_id};
    `;
    let projectAddQuery = `INSERT INTO Project (
        p_id,
        p_name,
        p_desc,
        manager_id) VALUES (${null}, '${p_name}', '${p_desc}',${manager_id})
    `;

    if(p_id){ //update
    let getProjectByIdQuery = `SELECT * FROM Project WHERE p_id = ${p_id};`;
      const response = await connection.query(projectUpdateQuery);
      const insertedObject = await connection.query(getProjectByIdQuery);
      const result = parseRowDataPacket(insertedObject);
      logger.info('Project Added ' + result.p_id);

      return {
        success: true,
        data: result[0]
      };
    }
    else{ //add
      const response = await connection.query(projectAddQuery);
      let getProjectByIdQuery = `SELECT * FROM Project WHERE p_id = ${response.insertId};`;
      const insertedObject = await connection.query(getProjectByIdQuery);
      const result = parseRowDataPacket(insertedObject);
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


export const getProjectsBasedOnManagerService = async (manager_id) =>{ 
  const getProjectsBasedOnManager = `select Project.p_id,Project.p_name,Project.p_desc,Project.manager_id,project_status_table.TestReady,project_status_table.Completed
  from(
    select intertable.p_id,COALESCE(intertable.TestReady,0) as TestReady,COALESCE(intertable.Completed,0) as Completed
    from (    
      select a1.p_id, TestReady, Completed
          from (select tab1.p_id as p_id, tab1.cnt as TestReady
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab1
          where tab1.c_status='TestReady' or tab1.c_status is Null)as a1 Left JOIN 
          (select tab2.p_id as p_id, tab2.cnt as Completed
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab2
          where tab2.c_status='Completed' or tab2.c_status is Null)as a2 on a1.p_id=a2.p_id
        UNION
        select a2.p_id, TestReady, Completed
          from (select tab1.p_id as p_id, tab1.cnt as TestReady
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab1
          where tab1.c_status='TestReady' or tab1.c_status is Null)as a1 RIGHT JOIN 
          (select tab2.p_id as p_id, tab2.cnt as Completed
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab2
          where tab2.c_status='Completed' or tab2.c_status is Null)as a2 on a1.p_id=a2.p_id) as intertable)as project_status_table, Project
      where Project.p_id=project_status_table.p_id and manager_id = ${manager_id};`;
  try{
    const response = await  connection.query(getProjectsBasedOnManager);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Projects Fetched');

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

export const getProjectsService = async () =>{ 
  const getProjectsBased = `select Project.p_id,Project.p_name,Project.p_desc,Project.manager_id,project_status_table.TestReady,project_status_table.Completed
  from(
    select intertable.p_id,COALESCE(intertable.TestReady,0) as TestReady,COALESCE(intertable.Completed,0) as Completed
    from (    
      select a1.p_id, TestReady, Completed
          from (select tab1.p_id as p_id, tab1.cnt as TestReady
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab1
          where tab1.c_status='TestReady' or tab1.c_status is Null)as a1 Left JOIN 
          (select tab2.p_id as p_id, tab2.cnt as Completed
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab2
          where tab2.c_status='Completed' or tab2.c_status is Null)as a2 on a1.p_id=a2.p_id
        UNION
        select a2.p_id, TestReady, Completed
          from (select tab1.p_id as p_id, tab1.cnt as TestReady
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab1
          where tab1.c_status='TestReady' or tab1.c_status is Null)as a1 RIGHT JOIN 
          (select tab2.p_id as p_id, tab2.cnt as Completed
          from ((select p_id,c_status,count(c_id) as cnt
              from Project Left Join Component on p_id=project_id
              group by Project.p_id,c_status) )as tab2
          where tab2.c_status='Completed' or tab2.c_status is Null)as a2 on a1.p_id=a2.p_id) as intertable)as project_status_table, Project
      where Project.p_id=project_status_table.p_id ;`;
  try{
    const response = await  connection.query(getProjectsBased);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Projects Fetched');

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

export const getProjectBasedOnIdService = async (p_id) =>{ 
  const getProjectsBasedOnId = `SELECT * FROM Project WHERE p_id = ${p_id}`;
  try{
    const response = await  connection.query(getProjectsBasedOnId);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Projects Fetched');

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


export const getTotalProjectsCountService = async () => {
  const getTotalProjectsCountQuery =   `SELECT COUNT(*) AS COUNT FROM Project`;
  try{
    const response = await connection.query(getTotalProjectsCountQuery);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('Projects Count Fetched', parsedResponse);

    // logger.info('Fetched Project Count', parsedResponse);
    return {
      success: true,
      data: parsedResponse
    };
  }
  catch(e){
    console.log(e);
    return{
      success: false,
      message: e.message 
    
    }
  }
}
