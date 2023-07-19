import usersService from "../services/users.service.js";
import userResponse from "../persistencia/DTOs/userResponse.dto.js";

export const signup = async (req,res) =>{
    const { email, password } = req.body;

    const user = await usersService.findUser({ email });
    if (user) {
        return res.redirect('/api/errorSignup')
    }
    await usersService.createUser(req.body);
    res.redirect('/api')
}

export const logout = async (req,res) =>{
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            res.redirect('/api')
        }
    });
}

export const currentUser = async (req,res) =>{
    try{
        const user = new userResponse(req.user);;
        res.send(user);
    }
    catch(error){
        res.json({error: error.message});
    }
}

