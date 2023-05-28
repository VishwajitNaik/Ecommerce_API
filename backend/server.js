const app = require('./app');
const path = require("path")
// const port = process.env.PORT;
// const dotenv = require('dotenv');
const dotenv = require('dotenv');

dotenv.config({path:"backend/config/config.env"})

const connDB  = require('./config/database');
const console = require('console');
//Handling Uncaught Exception
process.on("uncaughtException", (err)=>{
    console.log(`ERROR: ${err.message}`);
    console.log("shutting down the server due to unhandle Uncaught Exception");
    process.exit(1);
}) 

// config
// dotenv.config();

connDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

// console.log(youtube)

// Unhandleed Pormise Rejection
process.on("unhandledRejection", (err)=>{
    console.log(`ERROR: ${err.message}`);
    console.log("shutting down the server due to unhandle promis rejection");
    server.close(()=>{
        process.exit(1);
    })
})