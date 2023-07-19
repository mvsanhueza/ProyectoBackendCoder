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

export default routerViews;