import usersService from "../services/users.service.js";
import userResponse from "../persistencia/DTOs/userResponse.dto.js";
import config from "../config/config.js";
import { transporter } from "../utils/nodemailer.js";
import jwt from 'jsonwebtoken'
import CustomError from "../services/errors/CustomError.js";
import { generateUserUpdateError } from "../services/errors/info.js";
import ENUM_Errors from "../services/errors/enums.js";

export const signup = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    const user = await usersService.findUser({ email });
    if (user || !email || !password || !first_name || !last_name) {
        req.logger.info('Falta algun dato para el registro')
        return res.status(400).redirect('/api/errorSignup')
    }
    await usersService.createUser(req.body);
    req.logger.debug('Usuario creado correctamente');
    res.status(200).redirect('/api')
}

export const logout = async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            req.logger.error('Error al cerrar sesión: ' + error.message);
            res.send(error);
        }
        else {
            res.redirect('/api')
            req.logger.debug('Sesión cerrada correctamente');
        }
    });
}

export const sendRecoverPassword = async (req, res) => {

    const { email } = req.body;

    //Se analiza si existe usuario con el mail colocado:
    const user = await usersService.findUser({ email });
    if (!user || !email) {
        req.logger.info('Falta algun dato para la recuperación de contraseña')
        return res.redirect('/api/')
    }

    //Se envía por email el link de recuperacion de contraseña:

    //Se crea el token:
    let token = jwt.sign({ userId: user._id }, config.session_secret, { expiresIn: "1h" });

    //Link de la forma /api/sessions/recoverPassword/userId/token
    let link = 'http://localhost:' + config.port + '/api/sessions/recoverPassword/' + user._id + '/' + token;

    //Se genera el texto html de email
    let htmlMail = `<h2> ¿Quieres recuperar tu contraseña? </h2>`;
    htmlMail += `<p>Para recuperar tu contraseña <a href="${link}">haz click aquí </a></p>`;
    //Se envía el mail con el ticket:
    let Sendemail = await transporter.sendMail({
        to: user.email,
        subject: `Recuperación de contraseña`,
        html: htmlMail
    });

    //Redirige a página con mensaje, email enviado favor recupera contraseña:
    res.redirect('/api/recoverEmailSend');
}

export const autorizationUserRestore = async (req, res, next) => {
    const { uid, token } = req.params;

    try {
        //Se busca el usuario por id:
        const user = await usersService.findUserById(uid);

        if (!user || !token) {
            CustomError.createError({
                name: "Link de recuperación incorrecto",
                cause: generateUserUpdateError,
                message: "El link de recuperación es incorrecto",
                code: ENUM_Errors.INVALID_TYPES_ERROR,
            })
        }

        //Se verifica que el token sea válido:
        jwt.verify(token, config.session_secret, (error, credentials) => {
            if (error) {
                return res.redirect('/api/forgetPassword')
            }

            //En caso contrario redirige a un cambio de contraseña exitoso:
            res.redirect('/api/recoverPassword/' + uid);
        })
    }
    catch (error) {
        req.logger.error('Error al obtener los productos del carrito: ' + error.message)
        next(error);
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = new userResponse(req.user);
        res.status(200).send(user);
    }
    catch (error) {
        req.logger.debug('Error al identificar al usuario actual: ' + error.message);
        res.status(500).json({ error: error.message });
    }
}

