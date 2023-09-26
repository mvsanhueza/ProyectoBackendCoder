import { Router } from "express";


const routerViews = Router();

routerViews.get('/', (req, res) => {
    res.render('login');
})

routerViews.get('/signup', (req, res) => {
    res.render('signup');
})

routerViews.get('/errorLogin', (req, res) => {
    res.render('errorLogin');
})

routerViews.get('/errorSignup', (req, res) => {
    res.render('errorSignup');
})

routerViews.get('/recoverEmailSend', (req,res) =>{
    res.render('recoverEmailSend');
})

routerViews.get('/forgetPassword', (req,res) =>{
    res.render('forgetPassword')
})

routerViews.get('/recoverPassword/:uid', (req,res) =>{
    res.render('recoverPassword', {uid: req.params.uid});
})

routerViews.get('/profile', (req,res) =>{
    res.render('profile',{user: req.user});
})

export default routerViews;