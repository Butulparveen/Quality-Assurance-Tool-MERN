//SJSU CMPE 138 Spring 2022 TEAM3 

import { addTestCaseService, getTestCasesBasedOnComponentService, getTestCasesBasedOnTesterService, getTotalTestCaseCountService, getTestCaseBasedOnIdService } from "../services/testCaseService.js";
import { sendInternalServerError, sendCustomError, sendCustomSuccess } from "./common.js";
export const addTestCase = async (req, res) => {
    const serviceResponse = await addTestCaseService(req.body);
    if(serviceResponse.success === true){
        sendCustomSuccess(res, serviceResponse.data);
    }
    else{
        sendInternalServerError(res);
    }
}
export const getTestCasesBasedOnComponent = async (req, res) => {
    const {component_id} = req.params;
    const serviceResponse = await getTestCasesBasedOnComponentService(component_id);
    if(serviceResponse.success === true){
        sendCustomSuccess(res, serviceResponse.data);
    }
    else{
        sendInternalServerError(res);
    }
}

export const getTestCasesBasedOnTester = async (req, res) => {
    const {tester_id} = req.params;
    const serviceResponse = await getTestCasesBasedOnTesterService(tester_id);
    if(serviceResponse.success === true){
        sendCustomSuccess(res, serviceResponse.data);
    }
    else{
        sendInternalServerError(res);
    }
}

export const getTestCaseBasedOnId = async (req, res) => {
    const {tc_id} = req.params;
    const serviceResponse = await getTestCaseBasedOnIdService(tc_id);
    if(serviceResponse.success === true){
      sendCustomSuccess(res, serviceResponse.data);
    }
    else{
      sendInternalServerError(res);
    }
  }

export const getTotalTestCaseCount = async (req, res) => {
    const serviceResponse = await getTotalTestCaseCountService();
    if(serviceResponse.success === true){
      sendCustomSuccess(res, serviceResponse.data);
    }
    else{
      sendInternalServerError(res);
    }
  }
  
// export const getComponentsBasedOnProject = (req, res) => {
//   console.log(req);
//   const {project_id} = req.params;
//   const getComponentsBasedOnProject=  "SELECT * FROM Component WHERE project_id = ?";
//   const getProjectBasedOnId = "SELECT * FROM Project WHERE p_id = ?"
//   connection.query(getProjectBasedOnId, [project_id], (err, result) => {
//     if(result){
//       connection.query(getComponentsBasedOnProject, [project_id], (err, result)=>{
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


//   try{
//       const {
//           tc_id, 
//           tc_name,
//           tc_desc,
//           tc_status,
//           mode_of_execution,
//           component_id,
//           tester_id,         
//       } = req.body;

//       const getTestCaseByIdQuery = 'SELECT * FROM TestCase WHERE tc_id = ?;';

//       const testCaseUpdateQuery = `UPDATE TestCase SET
//           tc_name = ?,
//           tc_desc = ?,
//           tc_status = ?,
//           mode_of_execution = ?,
//           component_id = ?,
//           tester_id = ?
//           WHERE tc_id = ?;
//       `;
//       const testCaseAddQuery = `INSERT INTO TestCase (
//           tc_id,
//           tc_name,
//           tc_desc,
//           tc_status,
//           mode_of_execution,
//           component_id,
//           tester_id) VALUES (NULL, ?, ?,?,?,?, ?)
//       `;

//       const getLastInerstedIdQuery = `SELECT LAST_INSERT_ID();`;

//       if(tc_id){ //Update
//           connection.query(testCaseUpdateQuery, [
//               tc_name,
//               tc_desc, 
//               tc_status,
//               mode_of_execution,
//               component_id,
//               tester_id
//           ], (err, result) => {
//               if(err){
//                 console.log(err); 
//                   sendInternalServerError(res);
//               }
//               else{
//                   connection.query(getTestCaseByIdQuery, [tc_id], (err, result)=>{
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
//           connection.query(testCaseAddQuery, [
//               tc_name,
//               tc_desc,
//               tc_status,
//               mode_of_execution, 
//               component_id,
//               tester_id, 
//           ], (err, result) => {
//               if(err){
//                   console.log(err);
//                   sendInternalServerError(res);
//               }
//               else{
//                   connection.query(getLastInerstedIdQuery, (err, result) => {
//                       if(result){
//                           let id = result[0]['LAST_INSERT_ID()'];
//                           connection.query(getTestCaseByIdQuery, [id], (err, result)=>{
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
//}

// export const getTestCasesBasedOnComponent = (req, res) => {
//   const {testlead_id} = req.params;
//   console.log(testlead_id);
//   const getComponentsBasedOnTestLead=  "SELECT * FROM Component WHERE testlead_id = ?";
//   const getUserBasedOnId = "SELECT * FROM User WHERE e_id = ?"
//   connection.query(getUserBasedOnId, [testlead_id], (err, result) => {
//     if(result){
//       connection.query(getComponentsBasedOnTestLead, [testlead_id], (err, result)=>{
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