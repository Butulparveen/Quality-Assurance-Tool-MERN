//SJSU CMPE 138 Spring 2022 TEAM3 

import { BACKEND_URL } from "./constants";
import { BACKEND_PORT } from "./constants";
export const signin = async (payload) => {
    const options = {
        method: 'POST',
        headers:  {'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }
    const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/user/signin`, options);
    const status = response.status;
    const data = await response.json();
    return {status, data};
}


export const signup = async (payload) => {
    const options = {
        method: 'POST',
        headers: {'Content-Type':  'application/json'},
        body: JSON.stringify(payload),
    };
    
    const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/user/signup`, options);
    const status = response.status;
    const data = await response.json();
    return {status, data};
}