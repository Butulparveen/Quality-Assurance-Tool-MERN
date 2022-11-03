//SJSU CMPE 138 Spring 2022 TEAM3 

import { BACKEND_URL, BACKEND_PORT } from "./constants";


export const addComponentService = async (component) => {
  console.log(component);
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(component)
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/component/new`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}

export const fetchComponentDetailsService = async (id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/component/details/${id}`, options);
  const status = response.status;
  const data = await response.json();
  console.log('Component Service ', data);
  return { status, data };
}

export const fetchComponentListOfProjectService = async(project_id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/component/project/${project_id}`, options);
  const status = response.status;
  const data = await response.json();
  console.log('Component Service ', data, status);
  return { status, data };
}


export const fetchComponentListOfTestleadService = async(testlead_id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/component/test_lead/${testlead_id}`, options);
  const status = response.status;
  const data = await response.json();
  console.log('Component Service ', data);
  return { status, data };
}

export const getTotalComponentCountService = async () => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/component/count`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}
