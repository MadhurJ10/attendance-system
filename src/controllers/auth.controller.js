import AuthService from "../services/auth.service.js";


class AuthController{
    constructor(){
        this.authService = new AuthService();
    }

    register = async (req ,res) => {
        try {
            const data = req.body;
            const result = await this.authService.register(data);


            return res.json({
                msg:"register or login done",
                
            })
        } catch (error) {
            res.error({
                msg:"errorrr"
            })
        }
    }

}

export default new AuthController();