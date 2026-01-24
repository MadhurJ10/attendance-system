import express from 'express';
import { authMiddleware , teacherOnly , studentOnly} from '../middleware/auth.middleware.js';
import classController from '../controllers/class.controller.js';


const route = express.Router();


// route.get('/student', authMiddleware ,studentOnly , (req ,res) => {
//     res.json({
//         msg:"stundent onlyyy"
//     })
// })

route.get('/teacher', authMiddleware ,teacherOnly , (req ,res) => {
    res.json({
        msg:"teacher onlyyy"
    })
})


route.post('/createclass' , authMiddleware , teacherOnly , classController.createClass);
route.post('/:id/add-student' , authMiddleware , teacherOnly , classController.addStudent);
route.get('/all-student' , authMiddleware , teacherOnly  , classController.getStudent); // to get all the student in system;
route.get('/:id' , authMiddleware , classController.getClass) // get detail about specific class


export default route;