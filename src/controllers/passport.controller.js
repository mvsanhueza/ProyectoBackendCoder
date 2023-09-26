import config from '../config/config.js'
import passport from 'passport';
import usersService from '../services/users.service.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
//import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { compareData } from '../utils/utils.js';

//Serializadores:
passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersService.findUserById(id)
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})

//Estrategia passport local:
passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            //Se analiza si es superAdmin:
            const user = await usersService.findUser({ email, externalLogin: false });

            if (!user) {
                req.logger.warning('Usuario no encontrado')
                return done(null, false);
            }

            const isSuperAdminPasswordValid = await compareData(password, config.admin_password);
            //Se analiza si es superAdmin:
            if(isSuperAdminPasswordValid && email === config.admin_email){
                user.role = 'admin';
            }
            else if (user.role === 'admin'){
                user.role = 'user';
            }
            
            const isPasswordValid = await compareData(password, user.password);
            if (!isPasswordValid) {
                req.logger.debug('Contraseña incorrecta')
                return done(null, false);
            }           

            done(null, user);
        }
        catch (error) {
            req.logger.error(error.message);
            done(error);            
        }
    }
))

//Estrategia passport github:
passport.use('githubLogin', new GithubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/github',
    },
    async (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json;

        try {
            const userDB = await usersService.findUser({ externalLogin: true, githubId: profile.id });
            if (userDB) {
                return done(null, userDB);
            }

            const user = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1] || '',
                email: email ?? 'default@github.com',
                externalLogin: true,
                githubId: profile.id,
                password: '123456',
            }

            const newUser =  await usersService.createUser(user);
            done(null, newUser);
        }
        catch (error) {
            done(error);
        }
    }
))

//Estrategia passport facebook:
// passport.use('facebookLogin', new FacebookStrategy(
//     {
//         clientID: process.env.FACEBOOK_CLIENT_ID,
//         clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//         callbackURL: 'http://localhost:8080/api/sessions/facebook',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const { name, email } = profile._json;
//         console.log(profile);
//         try {
//             const userDB = await userModel.findOne({ externalLogin: true, facebookId: profile.id });
//             if (userDB) {
//                 return done(null, userDB);
//             }

//             const passwordHashed = await hashData('123456');
//             const user = {
//                 first_name: name.split(' ')[0],
//                 last_name: name.split(' ')[1] || '',
//                 email: email ?? 'default@github.com',
//                 externalLogin: true,
//                 facebookId: profile.id,
//                 password: passwordHashed,
//             }

//             const newUser = await userModel.create(user);
//             done(null, newUser);
//         }
//         catch (error) {
//             done(error);
//         }
//     }
// ))

//Estrategia passport Google:
passport.use('googleLogin', new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/google',
    },
    async (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json;
        console.log(profile);
        try {
            const userDB = await usersService.findUser({ externalLogin: true, googleId: profile.id });
            if (userDB) {
                return done(null, userDB);
            }

            const user = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1] || '',
                email: email ?? 'default@google.com',
                externalLogin: true,
                googleId: profile.id,
                password: '123456',
            }

            const newUser = await usersService.createUser(user);
            done(null, newUser);
        }
        catch (error) {
            done(error);
        }
    }
));