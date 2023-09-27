import CustomError from "../services/errors/CustomError.js";
import usersService from "../services/users.service.js";
import { compareData, hashData } from '../utils/utils.js';
import { generateUserUpdateError } from "../services/errors/info.js";
import ENUM_Errors from "../services/errors/enums.js";
import userResponse from "../persistencia/DTOs/userResponse.dto.js";
import { transporter } from "../utils/nodemailer.js";


class usersController {
    async changeRoleUser(req, res, next) {
        try {
            const { uid } = req.params;
            //Se busca el usuario en cuestion:
            const user = await usersService.findUserById(uid);
            console.log(user);
            if (!user) {
                CustomError.createError({
                    name: "User not found in data base",
                    cause: "User not found in data base",
                    message: "El usuario no existe en la base de datos",
                    code: ENUM_Errors.DATABASE_ERROR
                })
            }

            const role = user.role;
            let newRole = role === 'premium' ? 'user' : 'premium';

            //Si el newRole es premium, exige tener documentos de id, domicilio y estado de cuenta:
            if (newRole === 'premium') {
                const docID = user.documents.some(doc => doc.name === "docId");
                const docAddress = user.documents.some(doc => doc.name === "docAddress");
                const docAccount = user.documents.some(doc => doc.name === "docAccountState")

                if (!docID || !docAddress || !docAccount) {
                    CustomError.createError({
                        name: "Incomplete documentation",
                        case: "Incomplete documentation",
                        message: "Requiere documentación de identifiación, domicilio y estado de cuenta para ser usuario premium",
                        code: ENUM_Errors.INVALID_TYPES_ERROR
                    })
                }
            }

            user.role = newRole;

            await usersService.updateUser(uid, user);

            req.logger.info(`User ${uid} changed role of user ${role} to ${newRole}`);
            res.status(200).json({ message: `User ${uid} changed role of user ${role} to ${newRole}` });
        } catch (error) {
            req.logger.error('Usuario no encontrado en la base de datos' + error.message);
            next(error);
        }
    }

    async updateUserPassword(req, res, next) {
        const { uid } = req.params;
        const { password } = req.body;

        try {
            //Se busca el usuario por id:
            const user = await usersService.findUserById(uid);

            if (!user || !password) {
                CustomError.createError({
                    name: "Link de recuperación incorrecto",
                    cause: generateUserUpdateError,
                    message: "El link de recuperación es incorrecto",
                    code: ENUM_Errors.INVALID_TYPES_ERROR,
                })
            }
            //Se analiza que el usuario tenga distinta contraseña:
            const samePassword = await compareData(password, user.password);
            if (samePassword) {
                CustomError.createError({
                    name: "Contraseña igual",
                    cause: "La contraseña debe ser distinta a la anterior",
                    message: "La contraseña es igual a la anterior",
                    code: ENUM_Errors.INVALID_TYPES_ERROR,
                })
            }

            //Se actualiza la contraseña:
            user.password = await hashData(password);
            await usersService.updateUser(uid, user);

            //Se redirige a un cambio de contraseña exitoso:
            res.redirect('/api');
        }
        catch (error) {
            req.logger.error('Error al actualizar contraseña del usuario: ' + error.message)
            next(error);
        }
    }

    async postDocumentUser(req, res, next) {
        try {
            if (!req.file) {
                CustomError.createError({
                    name: "Error en upload",
                    cause: 'Error en upload documento',
                    message: "Error en upload documento",
                    code: ENUM_Errors.INVALID_TYPES_ERROR,
                })
            }
            const body = req.body;
            const docName = Object.values(body)[0];
            const uid = req.params.uid;
            const response = await usersService.uploadDocument(uid, docName, req.file);
            if (response) {
                CustomError.createError({
                    name: "Error en upload",
                    cause: 'Error en upload documento',
                    message: "Error en upload documento",
                    code: ENUM_Errors.DATABASE_ERROR,
                })
            }
            //Se actualiza el usuario con sus documentos:
            const userUpdated = await usersService.findUserById(uid);
            req.user = userUpdated;

            res.status(200).send({ message: "Document uploaded Succesfully" })
        }
        catch (error) {
            req.logger.error('Error en upload: ' + error.message);
            next();
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await usersService.findAllUsers();

            const usersResponse = users.map(u => new userResponse(u));

            res.status(200).send(usersResponse);
        }
        catch (error) {
            req.logger.error('Error al obtener usuarios: ' + error.message);
            next();
        }
    }

    async getUsersEdit(req,res,next){
        try {
            const users = await usersService.findAllUsers();
            //Se filtra el usuario conectado (se supone admin)
            const usersFilter = users.filter(u => u.email != req.user.email);
            res.render('users',{session: req.user, users: usersFilter});
        }
        catch (error) {
            req.logger.error('Error al obtener usuarios: ' + error.message);
            next();
        }
    }

    async deleteUsersUnconnected(req, res, next) {
        try {
            const users = await usersService.findAllUsers();
            console.log(users);
            for (let i = 0; i < users.length; i++){
                const user = users[i];
                console.log(user);
                if (user.role === 'admin')
                    continue;

                //Se verifica conexión de 2 dias:
                const diffConnection = new Date() - user.last_connection;
                //milisegundos de un dia:
                const milisecondsDay = 1000 * 60 * 60 * 24;                

                if (diffConnection / milisecondsDay < 2.0)
                    continue;

                //En caso que sea superior a 2 dias se elimina el usuario:

                const response = await usersService.deleteUser(user._id);

                //Una vez eliminado se envia mail notificando:
                //Se genera el texto html de email
                let htmlMail = `<h2> Su cuenta ha sido eliminada por inactividad </h2>`;
                htmlMail += `<h3> Esperamos verte pronto </h3>`;

                //Se envía el mail con el ticket:
                let email = await transporter.sendMail({
                    to: user.email,
                    subject: `Te extrañaremos`,
                    html: htmlMail
                });
            }

            res.status(200).send({message: "Usuarios inactivos eliminados"})
        }
        catch (error) {
            req.logger.error('Error al eliminar usuarios inactivos: ' + error.message);
            next();
        }
    }

    async deleteUser(req,res,next){
        try {
            const {uid} = req.params;

            await usersService.deleteUser(uid);

            res.status(200).send({message: 'Usuario eliminado'});
        }
        catch (error) {
            req.logger.error('Error al eliminar usuario: ' + error.message);
            next();
        }
    }

}

export default new usersController();