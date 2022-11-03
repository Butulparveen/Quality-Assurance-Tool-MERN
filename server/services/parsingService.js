//SJSU CMPE 138 Spring 2022 TEAM3 

export const parseRowDataPacket = (obj) => {
  return Object.values(JSON.parse(JSON.stringify(obj)));
}