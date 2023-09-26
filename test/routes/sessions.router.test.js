import {expect} from 'chai';
import supertest from 'supertest';
import { dropUsers } from '../setup.test.js';

const requester = supertest('http://localhost:8080');


describe('TEST routes sessions', () =>{
    before( async () =>{
        await dropUsers();
    })

    const mockUser = {
        first_name: "Prueba",
        last_name: "Coder",
        email: "correo@correo.com",
        password: "123456",
    };

    let cookieSession;

    //Creación del signup:
    it('[POST] /api/sessions/signup register succesfully', async () =>{
        const response = await requester.post('/api/sessions/signup').send(mockUser);
        expect(response.statusCode).to.be.eql(302);
        expect(response.header.location).to.be.eql('/api');
    })

    it('[POST] /api/sessions/signup Email already exists', async () =>{
        const response = await requester.post('/api/sessions/signup').send(mockUser);
        expect(response.statusCode).to.be.eql(302);
        expect(response.header.location).to.be.eql('/api/errorSignup');
    })

    it('[POST] /api/sessions/login login wrong password', async () =>{
        const userData = {email: mockUser.email, password: "abcde"};
        const response = await requester.post('/api/sessions/login').send(userData);

        expect(response.statusCode).to.be.eql(302);
        expect(response.header.location).to.be.eql('/api/errorLogin')
    })

    //login:
    it('[POST] /api/sessions/login login succesfully', async () =>{
        const userData = {email: mockUser.email, password: mockUser.password};
        const response = await requester.post('/api/sessions/login').send(userData);

        const cookieHeader = response.headers['set-cookie'][0];

        cookieSession = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1]
        }


        expect(response.statusCode).to.be.eql(302);
        expect(response.header.location).to.be.eql('/api/products');
    })


    //current:
    it('[GET] /api/sessions/current current user', async () =>{
        const response = await requester.get('/api/sessions/current').set('Cookie', `${cookieSession.name}=${cookieSession.value}`);
        expect(response.statusCode).to.be.eql(200);
        expect(response.body.email).to.be.eql(mockUser.email);
        expect(response.body.password).to.not.be.ok;
    })
})