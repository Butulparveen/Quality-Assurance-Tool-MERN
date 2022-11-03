import { connection, logger } from '../index.js';
import { parseRowDataPacket } from './parsingService.js';
import { insertTester } from './testerService.js';
import { insertDeveloper } from './developerService.js';
import pkg1 from 'bcrypt';

const { compare, genSalt, hash: _hash } = pkg1;
export const signUpService = async (user) => {
  try{
    const {
      e_id,
      email,
      firstName,
      lastName,
      type, 
      pwd  
    } = user;
    let getUserByIdQuery = `SELECT * FROM User WHERE e_id = ${e_id}`;
    const getLastInerstedIdQuery = `SELECT LAST_INSERT_ID();`;

    let sql_findEmail = `SELECT * FROM User WHERE email = '${email}'`;
    
    async function hashPassword(password) {
      const salt = await genSalt(10);
      const hash = await _hash(password, salt);
      return hash;
    }
    const checkEmailResponse = await connection.query(sql_findEmail);
    if(parseRowDataPacket(checkEmailResponse).length > 0){
      return {
        success: false,
        message: 'Email Already exists'
      };
    }

    let finalObj;
    finalObj = hashPassword(pwd).then(async (customerPassword) => {

      let sql_insert = `INSERT INTO User 
      (e_id, 
      email, 
      firstName, 
      lastName, 
      pwd, 
      type) VALUES (${null}, '${email}', '${firstName}', '${lastName}', '${customerPassword}', '${type}')`;


      const response = await connection.query(sql_insert);
      getUserByIdQuery = `SELECT * FROM User WHERE e_id = ${response.insertId}`;
      const insertedObject = await connection.query(getUserByIdQuery);
      const result = parseRowDataPacket(insertedObject);
      logger.info('User Signed up', result.e_id);
      
      if(type === 'tester'){
        const serviceResponse = await insertTester(response.insertId);
        if(serviceResponse.length> 0){
          return {
            success: true,
            data: result[0]
          }
        }
        else{ 
          //delete recently entered user or do the entire processing in one transaction
        }
      }
      else if(type === 'developer'){
        const serviceResponse = await insertDeveloper(response.insertId);
        if(serviceResponse.length> 0){
          return {
            success: true,
            data: result[0]
          }
        }
        else{ 
          //delete recently entered user or do the entire processing in one transaction
        }
      }
      else{
        return {
          success: true,
          data: result[0]
        }
      }
    });
    return finalObj;
  }
  catch(e){
    console.log(e);
    return{
      success: false,
      message: e.message
    }
  }
}


export const signInService = async (credentials) => {
  const {email, pwd} = credentials;
  let sql_findEmail = `SELECT * FROM User where email = '${email}'`;
  try{
    const response = await connection.query(sql_findEmail);
    const parsedResponse = parseRowDataPacket(response);
    logger.info('User Signed up', parsedResponse.e_id);
    if(parsedResponse.length > 0){
      const match = await pkg1.compareSync(pwd, parsedResponse[0].pwd.toString());
      if(match){
        return {
          success: true,
          data: parsedResponse[0]
        }
      }
      else{
        return {
          success: false,
          message: 'Incorrect Credentials'
        }
      }
      
    }
    else{
      return {
        success: false,
        message: 'User Not Present'
      }
    }

  }
  catch(err){
    return{
      success: false,
      message: err.message,
    }
  }
  
} 


  // const finalObj = connection.query(sql_findEmail, [email], async (err, result) => {
  //   console.log(err); 
  //   if(result[0]){
  //     // const accessToken = createJWT(email, result[0].userId, 3600);
  //     // const tokenVerified = verifyToken(accessToken);
  //     console.log('Result', result[0], result[0].pwd.toString());
  //     console.log(typeof result[0].pwd.toString(), typeof pwd);
  //     const match = pkg1.compareSync(pwd, result[0].pwd.toString());
  //     console.log(match);
  //     if(match){
  //       return{
  //         success:true,
  //         data: result,
  //       }
  //     }
  //     else{
  //       return{
  //         success: false,
  //         message: 'Unauthorized User'
  //       }
  //     }
  //   }
  //   else {
  //     return{
  //       success: false,
  //       message: 'Could not find entity'
  //     }
  //   }
  // });
  // console.log('FINAL OBJECT',finalObj);
  // return finalObj;