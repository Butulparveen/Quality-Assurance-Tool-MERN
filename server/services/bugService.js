//SJSU CMPE 138 Spring 2022 TEAM3 

import { connection } from "../index.js";
import { getComponentsBasedOnTestLeadService } from "./componentService.js";
import { parseRowDataPacket } from "./parsingService.js";


export const addBugService = async (bug) => {
  try {
    const {
      b_id,
      b_status,
      created_by,
      resolved_by,
      testcase_id,
    } = bug;
    let getBugByIdQuery = `SELECT * FROM Bug WHERE b_id = ${b_id};`;

    let bugUpdateQuery = `UPDATE Bug SET
        b_status = '${b_status}',
        created_by = ${created_by},
        resolved_by = ${resolved_by},
        testcase_id = ${testcase_id}
        WHERE b_id = ${b_id};
    `;
    
    if (b_id) { //Update
      const response = await connection.query(bugUpdateQuery);
      const insertedObject = await connection.query(getBugByIdQuery);
      const result = parseRowDataPacket(insertedObject);
      return {
        success: true,
        data: result[0]
      };
    }
    else { //Add New
      const newBugId = await getTotalBugs()+1;
      let data;
      let success;
      let message;
      /* Begin transaction */
      connection.beginTransaction(function(err) {
        if (err) { throw err; }
        
        connection.query('INSERT INTO Bug (b_id,b_status,created_by,resolved_by,testcase_id) VALUES (?,?, ?, ?, ?)', [newBugId, b_status, created_by, resolved_by, testcase_id], function(err, result) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
      
          // let commitedBugId = result.insertId;

          connection.query('SELECT * FROM tester WHERE tester_id = ?', [created_by], function(err, result){
            if(err){
              connection.rollback(function() {
                throw err;
              });
            }
            const {tester_id} = parseRowDataPacket(result)[0];
            if(tester_id){
              connection.query('UPDATE tester SET no_of_bugs_raised = no_of_bugs_raised + 1 WHERE tester_id = ?', [tester_id], function(err, result){
                if(err){
                  success = false;
                  message = 'Something went Wrong in transaction';
                  connection.rollback(function() {
                    throw err;
                  });
                }
                connection.query('SELECT * FROM Bug WHERE b_id = ?', [newBugId], function(err, result){
                  if(err){
                    success = false;
                    message = 'Something went Wrong in transaction';
                    connection.rollback(function() {
                      throw err;
                    });
                  }
                  data = parseRowDataPacket(result);
                  success = true;
                });
              });
            }
            else{
              connection.query('INSERT INTO tester (tester_id, no_of_bugs_raised) VALUES (?, ?)', [created_by, 0], function(err, result){
                if(err){
                  success = false;
                  message = 'Something went Wrong in transaction';
                  connection.rollback(function() {
                    throw err;
                  });
                }
                connection.query('SELECT * FROM Bug WHERE b_id = ?', [commitedBugId], function(err, result){
                  data = parseRowDataPacket(result);
                  success = true;
                })
              })
            }
            connection.commit(function(err) {
              if (err) { 
                connection.rollback(function() {
                  throw err;
                });
              }
              connection.end();
            });
          });
        });
      });
      
      /* End transaction */
            
     }

  }
  catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message
    };
  }
}

export const getBugBasedOnTesterService = async (tester_id) => {
  try{
    const getBugBasedOnTesterQuery = `SELECT * FROM Bug WHERE created_by = ${tester_id}`;
    const result = parseRowDataPacket(await connection.query(getBugBasedOnTesterQuery));
    return {
      success: true,
      data: result
    }
  }
  catch(e){
    console.log(e);
    return {
      success: false,
      message: e
    }
  }
}

export const getBugBasedOnDeveloperService = async (tester_id) => {
  try{
    const getBugBasedOnTesterQuery = `select table1.b_id, table1.testcase_id,table1.b_status,table1.tester_id,table1.resolved_by, table1.tc_name,User.firstName
    from (select * 
    from Bug,TestCase
    where Bug.testcase_id=TestCase.tc_id) as table1, User
    where table1.tester_id=User.e_id and table1.resolved_by = ${tester_id}`;
    const result = parseRowDataPacket(await connection.query(getBugBasedOnTesterQuery));
    return {
      success: true,
      data: result
    }
  }
  catch(e){
    console.log(e);
    return {
      success: false,
      message: e
    }
  }
}

export const getBugBasedOnTestCaseService = async (testcase_id) => {
  try{
    const getBugBasedOnTestCaseQuery = `SELECT * FROM Bug WHERE testcase_id = ${testcase_id}`;
    const result = parseRowDataPacket(await connection.query(getBugBasedOnTestCaseQuery));
    return {
      success: true,
      data: result
    }
  }
  catch(e){
    console.log(e);
    return {
      success: false,
      message: e
    }
  }
}


export const getTotalBugs = async () => {
  try{
    const getTotalBugCount = `SELECT COUNT(*) FROM Bug`;
    const result = parseRowDataPacket( await connection.query(getTotalBugCount));
    return result[0]['COUNT(*)'];

  }
  catch(e){
    console.log(e);
  }
}

// let bugAddQuery = `INSERT INTO Bug (
//   b_id,
//   b_status,
//   created_by,
//   resolved_by,
//   testcase_id) VALUES (${newBugId}, '${b_status}', '${created_by}','${resolved_by}',${testcase_id})
// `;

// const response = await connection.query(bugAddQuery);
// let getBugByIdQuery = `SELECT * FROM Bug WHERE b_id = ${response.insertId};`;
// const insertedObject = await connection.query(getBugByIdQuery);
// const result = parseRowDataPacket(insertedObject);
// return {
//   success: true,
//   data: result[0]
// };














// export const insertBug = async (obj) => {
//   try{
//     const {b_id, testcase_id, b_status, created_by, resolved_by} = obj;
//     const bugCount = await getTotalBugs() + 1;
//     const insertBugQuery = `INSERT INTO Bug (b_id, 
//       testcase_id, 
//       b_status, 
//       created_by, 
//       resolved_by) VALUES (${bugCount}, ${testcase_id}, '${b_status}',${created_by}, ${resolved_by})`;
//     const result = parseRowDataPacket(await connection.query(insertBugQuery));
    
//     console.log(result);
//     return {
//       success: true,
//       data: result
//     };
//   }
//   catch(e){
//     console.log(e);
//     return{
//       success: false,
//       message: e
//     }
//   }
// }


// export const updateBug = async (obj) => {
//   try{
//     const {b_id, testcase_id, b_status, created_by, resolved_by} = obj;
//     const insertBugQuery = `UPDATE Bug SET 
//         testcase_id = ${testcase_id}, 
//         b_status = ${b_status}, 
//         created_by = ${created_by}, 
//         resolved_by = ${resolved_by}
//         WHERE b_id = ${b_id}`;
//     const result = parseRowDataPacket(await connection.query(insertBugQuery));
//     return {
//       success: true,
//       data: result
//     };
//   }
//   catch(e){
//     console.log(e);
//     return{
//       success: false,
//       message: e
//     }
//   }
// }
