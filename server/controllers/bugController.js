//SJSU CMPE 138 Spring 2022 TEAM3 

import  {connection} from '../index.js';
import { addBugService, getBugBasedOnDeveloperService } from '../services/bugService.js';
import { sendCustomSuccess, sendInternalServerError } from './common.js';


export const addBug = async (req, res) => {
    const serviceResponse = await addBugService(req.body);
    if(serviceResponse.success === true){
        sendCustomSuccess(res, serviceResponse.data);
    }
    else{
        sendInternalServerError(res);
    }
}

export const getBugBasedOnDeveloper = async (req, res) => {
    const {developer_id} = req.params;
    const serviceResponse = await getBugBasedOnDeveloperService(developer_id);
    if(serviceResponse.success === true){
        sendCustomSuccess(res, serviceResponse.data);
    }
    else{
        sendInternalServerError(res);
    }
}