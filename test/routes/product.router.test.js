import { expect } from 'chai';
import supertest from 'supertest';
import { dropProducts, dropUsers } from '../setup.test.js';
import productsService from '../../src/services/products.service.js';

const requester = supertest('http://localhost:8080');

describe('TEST products routers', () => {

    let cookieSession;
    let cookieSessionUn;

    before(async () => {
        await dropProducts();
        await dropUsers();
        //Realizamos login de admin:
        const mockUser = {
            first_name: "Prueba",
            last_name: "Coder",
            email: "correo@correo.com",
            password: "123456",
            role: "admin"
        };

        const responseSignup = await requester.post('/api/sessions/signup').send(mockUser);
        const responseLogin = await requester.post('/api/sessions/login').send(mockUser);

        const cookieHeader = responseLogin.headers['set-cookie'][0];

        cookieSession = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1]
        }
    })

    const productMock = {
        title: "product test",
        description: "test",
        code: "A1",
        price: 20000,
        category: "test",
        stock: 30
    };

    let productId;

    it('[POST] Create product succesfully', async () => {

        const response = await requester.post('/api/products').set('Cookie', `${cookieSession.name}=${cookieSession.value}`).send(productMock);
        expect(response.statusCode).to.be.eql(200);
    })

    it('[POST] Product invalid', async () => {
        const productMockInv = {
            title: "product test",
            description: "test",
            code: "A1",
            category: "test",
            stock: 30
        }

        const response = await requester.post('/api/products').set('Cookie', `${cookieSession.name}=${cookieSession.value}`).send(productMockInv);

        expect(response.statusCode).to.be.eql(500);
    })

    it('[POST] Not authorized', async () => {
        //Se crea el usuario con rol user:
        const mockUser = {
            first_name: "Prueba",
            last_name: "Coder",
            email: "correo1@correo.com",
            password: "123456",
            role: "user"
        };
        const responseSignup = await requester.post('/api/sessions/signup').send(mockUser);
        const responseLogin = await requester.post('/api/sessions/login').send(mockUser);

        const cookieHeader = responseLogin.headers['set-cookie'][0];

        cookieSessionUn = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1]
        }

        const response = await requester.post('/api/products').set('Cookie', `${cookieSessionUn.name}=${cookieSessionUn.value}`).send(productMock)

        expect(response.statusCode).to.be.eql(403);
    })

    it('[GET] get products succesfully', async () => {
        const response = await requester.get('/api/products');

        expect(response.statusCode).to.be.eql(200);
    })

    it('[GET] get product by id', async () => {
        const products = (await productsService.getPageProducts("", 10, 1, "")).docs;

        //Se identifica el primer id del producto
        const id = products[0]._id.toString();
        productId = id;
        const response = await requester.get('/api/products/' + id);
        expect(response.statusCode).to.be.eql(200);
    })

    it('[GET] get product by id invalid', async () => {

        const response = await requester.get('/api/products/111');
        expect(response.statusCode).to.be.eql(500);
    })

    it('[PUT] put product succesfully', async () => {
        const productPost = { ...productMock, stock: 1, thumbnails: [] };

        const response = await requester.put('/api/products/' + productId).set('Cookie', `${cookieSession.name}=${cookieSession.value}`).send(productPost);

        expect(response.statusCode).to.be.eql(200);

        //Se revisa el stock del id modificado:
        const product = await productsService.getProductById(productId);
        expect(product.stock).to.be.eql(1);
    })

    it('[PUT] put product invalid', async () => {
        const productPost = {
            title: productMock.title,
            price: productMock.price,
        };

        const response = await requester.put('/api/products/' + productId).set('Cookie', `${cookieSession.name}=${cookieSession.value}`).send(productPost);

        expect(response.statusCode).to.be.eql(500);
    })

    it('[PUT] put product unauthorized', async () => {
        const productPost = { ...productMock, stock: 1, thumbnails: [] };

        const response = await requester.put('/api/products/' + productId).set('Cookie', `${cookieSessionUn.name}=${cookieSessionUn.value}`).send(productPost);

        expect(response.statusCode).to.be.eql(403);
    })

    it('[DELETE] delete product unauthorized role', async () => {
        const response = await requester.delete('/api/products/' + productId).set('Cookie', `${cookieSessionUn.name}=${cookieSessionUn.value}`);

        expect(response.statusCode).to.be.eql(403);
    })


    it('[DELETE] delete product', async () => {
        const response = await requester.delete('/api/products/' + productId).set('Cookie', `${cookieSession.name}=${cookieSession.value}`);

        expect(response.statusCode).to.be.eql(200);
    })


})