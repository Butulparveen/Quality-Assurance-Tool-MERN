# Quality-Assurance-Tool

## About the Repo
1. The repo consists of server folder which has all the backend and the middleware code for the application
2. In due time, the repo will also consist of client folder having all the code for the frontend part.

## Getting Started
1. Clone the repository, you can find command on the net.
2. Go to server folder and run ```npm instal```. 
   - This will install all required dependencies like mysql, cors, body-parser, express middleware, etc.
   - The way Node projects work is that all meta data and dependencies are present int the package.json. 
3. When all the dependencies are successfully installed run ```npm run start```.
   - This will start the backend server on port 5000

As of now the host of the database, password and few other important information is hard-coded in the code, which is NOT a good practice.
Later the project wil have .env files to protect such data. But for time being we can move ahead.

## Testing the local Server
1. Now since your server is running locally on port 5000, go to browser go to url http://localhost:5000/test/api
   - This should give you the output ```{"test":"API Testing","status":"OK"}```
2. To check Database connection, hit http://localhost:5000/test/db
   - This should give you the output ```{"test":"DB Testing","status":"OK","data":[{"name":"Rushil"},{"name":"Ankita"},{"name":"Nalini"},{"name":"Divija"},{"name":"Butul"},{"name":"Vaishak"}]}```

If both these tests are working, it indicates that server is up and running, ready to take requests and the connection to database(AWS RDS) is established and queries are running

Let me know if you are stuck anywhere....!!
