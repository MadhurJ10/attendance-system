import classModel from "../models/class.model.js"
import userModel from "../models/user.model.js";


class ClassService {
    constructor() {

    }

    async createClass(className, teacherId) {
        const create = await classModel.create({
            className: className,
            teacherId: teacherId
        })


        if (!create) {
            throw new Error("errror in creating class");
        }

        return create;
    }

    async addStudent(teacherId, studentId, classId) {
        // 1️⃣ check class ownership
        const classData = await classModel.findOne({
            _id: classId,
            teacherId: teacherId,
        });

        if (!classData) {
            throw new Error("Class not found or unauthorized access");
        }

        // 2️⃣ prevent duplicate student
        if (classData.studentIds.includes(studentId)) {
            throw new Error("Student already added to this class");
        }

        // 3️⃣ add student
        classData.studentIds.push(studentId);
        await classData.save();

        return classData;
    };

    async getClass(classId, teacherId) {
        const classData = await classModel
            .findOne({
                _id: classId,
                teacherId: teacherId,
            })
            .populate("studentIds", "name email role")  
            .populate("teacherId", "name email");        

        if (!classData) {
            throw new Error("Class not found or unauthorized access");
        }

        return classData;
    }

    async getStudent(){
        const data = await userModel.find({
            role : "student"
        })

        if(!data){
            throw new Error("no student is available")
        }

        return data;
    }

    async start(classId , teacherId){
        const result = await this.getClass(classId , teacherId);
        return result;
    }

}



export default ClassService;