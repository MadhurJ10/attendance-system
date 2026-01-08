import express from 'express';
import connectDb  from './src/config/db.js'
import app from './src/app.js';
import  config  from './src/config/environment.js';

const PORT = config.PORT || 5000

async function startServer() {
    try {
        await connectDb();
        console.log("db connected");

        app.listen(PORT , () => {
            console.log(`server runnig on ${PORT}`);
            console.log("server started");
        })
    } catch (error) {
        console.log("Server not working");
        console.log(error);
    }
}

startServer();