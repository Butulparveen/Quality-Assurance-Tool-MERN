//SJSU CMPE 138 Spring 2022 TEAM3 

import { connection } from "../index.js";
import { addProjectService, getProjectsBasedOnManagerService, getProjectBasedOnIdService, getTotalProjectsCountService, getProjectsService } from "../services/projectService.js";
import { sendInternalServerError, sendCustomError, sendCustomSuccess } from "./common.js";


export const addProject = async (req, res) => {
    const serviceResponse = await addProjectService(req.body);
    if(serviceResponse.success ===  true){
        sendCustomSuccess(res, serviceResponse.data);
    }
    else{
        sendInternalServerError(res);
    }
}

export const getProjectsBasedOnManager = async (req, res) => {
  const {manager_id} = req.params;
  let serviceResponse;
  if(manager_id === 'all'){
    serviceResponse = await getProjectsService();
  }
  else{
    serviceResponse = await getProjectsBasedOnManagerService(manager_id);
  }
  if(serviceResponse.success === true){
    sendCustomSuccess(res, serviceResponse.data);
  }
  else{
    sendInternalServerError(res);
  }
}


export const getProjectBasedOnId = async (req, res) => {
  const {p_id} = req.params;
  const serviceResponse = await getProjectBasedOnIdService(p_id);
  if(serviceResponse.success === true){
    sendCustomSuccess(res, serviceResponse.data);
  }
  else{
    sendInternalServerError(res);
  }
}

export const getTotalProjectCount = async (req, res) => {
  const serviceResponse = await getTotalProjectsCountService();
  if(serviceResponse.success === true){
    sendCustomSuccess(res, serviceResponse.data);
  }
  else{
    sendInternalServerError(res);
  }
}


// export const getProjectsBasedOnManager = (req, res) => {
//   console.log(req);
//   const {manager_id} = req.params;
//   const getProjectsBasedOnManager=  "SELECT * FROM Project WHERE manager_id = ?";
//   const getUserBasedOnId = "SELECT * FROM User WHERE e_id = ?"
//   connection.query(getUserBasedOnId, [manager_id], (err, result) => {
//     if(result){
//       connection.query(getProjectsBasedOnManager, [manager_id], (err, result)=>{
//         if(result[0]){
//             sendCustomSuccess(res, result);
//         }
//         else{
//             sendCustomError(res, 404, 'Entity Not Found');
//         }
//       });
//     }
//     else{
//         console.log(err);
//         sendInternalServerError(res);
//     }
//   });
// }

// export const addProject = (req, res) => {
    //   try{
    //       const {
    //           p_id, 
    //           p_name,
    //           p_desc, 
    //           manager_id,            
    //       } = req.body;
    
    //       const getProjectByIdQuery = 'SELECT * FROM Project WHERE p_id = ?;';
    
    //       const projectUpdateQuery = `UPDATE Project SET
    //           p_name = ?,
    //           p_desc = ?,
    //           manager_id = ?
    //           WHERE p_id = ?;
    //       `;
    //       const projectAddQuery = `INSERT INTO Project (
    //           p_id,
    //           p_name,
    //           p_desc, 
    //           manager_id) VALUES (NULL, ?, ?,?)
    //       `;
    
    //       const getLastInerstedIdQuery = `SELECT LAST_INSERT_ID();`;
    
    //       if(p_id){ //Update
    //           connection.query(projectUpdateQuery, [
    //               p_name,
    //               p_desc, 
    //               manager_id,
    //               p_id,
    //           ], (err, result) => {
    //               if(err){
    //                 console.log(err); 
    //                   sendInternalServerError(res);
    //               }
    //               else{
    //                   connection.query(getProjectByIdQuery, [p_id], (err, result)=>{
    //                       if(result[0]){
    //                           sendCustomSuccess(res, result[0]);
    //                       }
    //                       else{
    //                           sendCustomError(res, 404, 'Entity Not Found');
    //                       }
    //                   });
    //               }
    //           });
    //       }
    //       else{ //Add New
    //           connection.query(projectAddQuery, [
    //               p_name,
    //               p_desc, 
    //               manager_id, 
    //           ], (err, result) => {
    
    //               if(err){
    //                   console.log(err);
    //                   sendInternalServerError(res);
    //               }
    //               else{
    //                   connection.query(getLastInerstedIdQuery, (err, result) => {  
    //                       if(result){
    //                           let id = result[0]['LAST_INSERT_ID()'];
    //                           connection.query(getProjectByIdQuery, [id], (err, result)=>{
    //                               if(result[0]){
    //                                   sendCustomSuccess(res, result[0]);
    //                               }
    //                               else{
    //                                   sendCustomError(res, 404, 'Entity Not Found');
    //                               }
    //                           });
    //                       }
    //                       else{
    //                           console.log(err);
    //                           sendInternalServerError(res);
    //                       }
    //                   })
    //               }
    //           });
    //       }
    //   }
    //   catch(err){
    //     console.log(err);
    //       sendInternalServerError(res);
    //   }
    // }