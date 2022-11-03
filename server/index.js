//SJSU CMPE 138 Spring 2022 TEAM3 

import express from 'express';
import cors from  'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import util from 'util';
import winston from 'winston';
import pkg from 'winston';
// const { createLogger, format, transports } = require('winston');

const {format,transports} = pkg;

import testRouter from './routes/testRoutes.js';
import userRouter from './routes/userRotues.js';
import projectRouter from './routes/projectRoutes.js';
import componentRouter from  './routes/componentRoutes.js';
import testCaseRouter from  './routes/testCaseRoutes.js';
import bugRouter from  './routes/bugRotues.js';

const port = 5001;
const corsConfig = {
  credentials: true,
  origin: true,
};


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

export const connection = mysql.createConnection({
  host     : 'qa-tool.cbm1wfipyose.us-east-1.rds.amazonaws.com',
  port     : 3306,
  user     : 'admin',
  password : 'project180b',
  database: "qa_tool"
});


export const logger = winston.createLogger({
  transports:
      new transports.File({
      filename: 'logs/server.log',
      format:format.combine(
          format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
          format.align(),
          format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
      )}),
  });
  
// export const db = makeDb();
// const no = db.connect(connection).then(() => {console.log('connected as id ' + connection.threadId);})
//   .catch(e=>{console.error('error connecting: ' + err.stack);});


 
connection.connect((err) =>{
  if (err) {
    logger.info('error connecting: ' + err.stack);
    console.error('error connecting: ' + err.stack);
    return;
  }
  logger.info('Server connected as id ' + connection.threadId);
  console.log('connected as id ' + connection.threadId);
});

connection.query = util.promisify(connection.query).bind(connection);



//Primary Routes
app.use('/test', testRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/component', componentRouter);
app.use('/testCase', testCaseRouter);
app.use('/bug',bugRouter);