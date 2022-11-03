//SJSU CMPE 138 Spring 2022 TEAM3 

import { BACKEND_PORT, BACKEND_URL } from "./constants";

export const fetchProjectDetailsService = async (id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/project/details/${id}`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}

export const addProjectService = async (project) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/project/new`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}

export const fetchProjectListOfManagerService = async(manager_id) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/project/manager/${manager_id}`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}



export const getTotalProjectCountService = async () => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/project/count`, options);
  const status = response.status;
  const data = await response.json();
  return { status, data };
}
