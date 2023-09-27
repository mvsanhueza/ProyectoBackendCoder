import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { uploader } from "../utils/utils.js";
import { autorization } from "../middlewares/autorization.js";


const routerUsers = new Router();


routerUsers.get('/premium/:uid',autorization(['admin']), usersController.changeRoleUser);
routerUsers.post('/updatePassword/:uid', usersController.updateUserPassword)
routerUsers.post('/:uid/documents', uploader.single('file'), usersController.postDocumentUser);
routerUsers.get('/', usersController.getUsers);
routerUsers.get('/edit', autorization(['admin']), usersController.getUsersEdit);
routerUsers.delete('/', usersController.deleteUsersUnconnected);
routerUsers.delete('/:uid', autorization(['admin']), usersController.deleteUser);


export default routerUsers;