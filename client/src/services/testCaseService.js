//SJSU CMPE 138 Spring 2022 TEAM3 

import { BACKEND_PORT, BACKEND_URL } from "./constants";

export const addTestCaseService = async (testCase) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testCase)
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/testCase/new`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}

export const fetchTestCaseDetailsService = async (id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/testCase/details/${id}`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}

export const fetchTestCaseListOfComponentService = async(component_id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/testCase/component/${component_id}`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}


export const fetchTestCaseListOfTesterService = async(tester_id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/testCase/tester/${tester_id}`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}



export const getTotalTestCaseCountService = async () => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/testCase/count`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}


export const getNextStatus = currentStatus => {
  let nextStatus;
  switch(currentStatus){
    case 'ToDo':
      nextStatus = ['InProgress'];
      break;
    case 'InProgress':
      nextStatus = ['Passed', 'Failed'];
      break;
    case 'Passed':
      nextStatus = [];
      break;
    case 'Failed':
      nextStatus = ['Blocked'];
      break;
    case 'Blocked':
      nextStatus = ['Passed'];
      break;
    default:
      nextStatus = [];
      break;
  }
  return nextStatus;
}