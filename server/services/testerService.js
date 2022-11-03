import { connection, logger } from "../index.js";
import { parseRowDataPacket } from "./parsingService.js";

export const insertTester = async (tester_id) => {
    const testerAddQuery = `INSERT INTO tester (tester_id, no_of_bugs_raised) VALUES (${tester_id}, ${0})`;
    const result = await connection.query(testerAddQuery);
    const parsedResult = parseRowDataPacket(result);
    logger.info('Test Case Inserted', parsedResult);
    return parsedResult;
}

export const updateRaisedBugCountForTester = () => {
  
}