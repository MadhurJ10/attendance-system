import ClassService from "../services/class.service.js";



class ClassController {
    constructor() {
        this.classService = new ClassService();
    }

    createClass = async (req, res) => {
        try {
            const className = req.body.className;
            const teacherId = req.user.userId;
            const result = await this.classService.createClass(className, teacherId);

            return res.json({
                msg: "done",
                result,
            });
        } catch (error) {
            return res.status(500).json({
                msg: "error",
                error: error.message,
            });
        }
    }


    addStudent = async (req, res) => {
        try {
            const teacherId = req.user.userId;      // from JWT
            const { studentId } = req.body;         // extract properly
            const classId = req.params.id;           // correct access

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    msg: "studentId is required",
                });
            }

            const result = await this.classService.addStudent(
                teacherId,
                studentId,
                classId
            );

            return res.status(200).json({
                success: true,
                msg: "Student added successfully",
                result,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: "Error adding student",
                error: error.message,
            });
        }
    };


    getClass = async (req, res) => {
        try {
            const classId = req.params.id;
            const teacherId = req.user.userId;


            const result = await this.classService.getClass(classId, teacherId);

            return res.status(200).json({
                success: true,
                msg: "done",
                result,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: "Error to get class",
                error: error.message,
            });
        }
    }

    getStudent = async (req, res) => {
        try {
            const result = await this.classService.getStudent();
            return res.status(200).json({
                success: true,
                msg: "done",
                result,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: "Error to get student",
                error: error.message,
            });
        }
    }

}


export default new ClassController();