import express from 'express';
import { authMiddleware , teacherOnly , studentOnly} from '../middleware/auth.middleware.js';


const route = express.Router();


route.get('/student', authMiddleware ,studentOnly , (req ,res) => {
    res.json({
        msg:"stundent onlyyy"
    })
})



route.get('/teavher', authMiddleware ,teacherOnly , (req ,res) => {
    res.json({
        msg:"teacher onlyyy"
    })
})


export default route;