import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';


const route = express.Router();


route.post('/register' , authController.register)
route.post('/login' , authController.login)



export default route;