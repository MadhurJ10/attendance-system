import userModel from "../models/user.model.js"

class AuthService{

    async register(data){
        // const check = await userModel.findOne({email:data.email});

        // if(check){

        // }

        // const user = await userModel.create({
        //     email: data.email,
        //     password: data.password
        // });
        // console.log(user);
        const user = await userModel.find();
        console.log(user);
        
        return user;
    }
}

export default AuthService;