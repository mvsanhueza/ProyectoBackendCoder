import jwt from 'jsonwebtoken';

export const autorization = (roles) =>{
    return async(req,res,next) =>{
        if(!req.user){
            //Usuario no está logueado:
            res.status(401).json({error: 'Usuario no logueado'});
        }
        else{
            if(roles.includes(req.user.role)){
                next();
            }
            else{
                res.status(403).json({error: 'No tiene permisos para realizar esta acción'});
            }
            
        }
    }
}