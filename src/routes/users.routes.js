import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { uploader } from "../utils/utils.js";


const routerUsers = new Router();


routerUsers.get('/premium/:uid', usersController.changeRoleUser);
routerUsers.post('/updatePassword/:uid', usersController.updateUserPassword)
routerUsers.post('/:uid/documents', uploader.single('file'), usersController.postDocumentUser);


export default routerUsers;