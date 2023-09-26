import ENUM_Errors from '../../services/errors/enums.js';

export default (err, req, res, next) =>{ 
    console.log(err);
    switch(err.code){
        case ENUM_Errors.INVALID_TYPES_ERROR:
            res.status(500).send({status: "error", error: err.name})
            break;
        case ENUM_Errors.DATABASE_ERROR:
            res.status(500).send({status: "error", error: err.name})
            break;
        default: 
            res.status(500).send({status: "error", error: "Error desconocido"})
    }
}