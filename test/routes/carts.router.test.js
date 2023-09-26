import { expect } from 'chai';
import supertest from 'supertest';
import { dropCarts, dropProducts, dropUsers } from '../setup.test.js';
import productsService from '../../src/services/products.service.js';
import cartsService from '../../src/services/carts.service.js';

const requester = supertest('http://localhost:8080');

describe('TEST carts routers', () => {

    let cookieSessionAdm;
    let cookieSessionUser;
    let productId;
    let cartUserId;

    before(async () => {
        await dropProducts();
        await dropUsers();
        await dropCarts();
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

        cookieSessionAdm = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1]
        }

        //Creamos un producto:
        const productMock = {
            title: "product test",
            description: "test",
            code: "A1",
            price: 20000,
            category: "test",
            stock: 30
        };

        const responseProduct = await requester.post('/api/products').set('Cookie', `${cookieSessionAdm.name}=${cookieSessionAdm.value}`).send(productMock);

        //Se identifica el id del producto:
        const products = (await productsService.getPageProducts("", 10, 1, "")).docs;
        //Se identifica el primer id del producto
        const id = products[0]._id.toString();
        productId = id;

        //Sesion usuario:
        const responseSignup1 = await requester.post('/api/sessions/signup').send({ ...mockUser, email: "correo1@correo.com" ,role: "user" });
        const responseLogin1 = await requester.post('/api/sessions/login').send({email: "correo1@correo.com", password: mockUser.password});
        const cookieHeader1 = responseLogin1.headers['set-cookie'][0];

        cookieSessionUser = {
            name: cookieHeader1.split('=')[0],
            value: cookieHeader1.split('=')[1]
        }

        //Se identifica el id del carrito del usuario:
        const response = await requester.get('/api/sessions/current').set('Cookie', `${cookieSessionUser.name}=${cookieSessionUser.value}`);
        cartUserId = response.body.cart.id_cart;
    })

    it('[POST] create cart', async () => {
        const response = await requester.post('/api/carts');

        expect(response.statusCode);
    })

    it('[POST] add product to cart unauthorized', async () => {
        const response = await requester.post(`/api/carts/${cartUserId}/products/${productId}`).set('Cookie', `${cookieSessionAdm.name}=${cookieSessionAdm.value}`);
        expect(response.statusCode).to.be.eql(403);
    });

    it('[POST] add product to cart, invalid cart', async () => {
        const response = await requester.post(`/api/carts/${"1234"}/products/${productId}`).set('Cookie', `${cookieSessionUser.name}=${cookieSessionUser.value}`);
        expect(response.statusCode).to.be.eql(500);
    });

    it('[POST] add product to cart, invalid product', async () => {
        const response = await requester.post(`/api/carts/${cartUserId}/products/${"1234"}`).set('Cookie', `${cookieSessionUser.name}=${cookieSessionUser.value}`)
        expect(response.statusCode).to.be.eql(500);
    });

    it('[POST] add product to cart, succesfully', async () => {
        const response = await requester.post(`/api/carts/${cartUserId}/products/${productId}`).set('Cookie', `${cookieSessionUser.name}=${cookieSessionUser.value}`);
        expect(response.statusCode).to.be.eql(200);

        //Se verifica que se haya agregado el producto:
        const products = (await cartsService.getCartById(cartUserId)).products;
        const productsIds = products.map(p=>p.id_product.toString());
        expect(productsIds).to.deep.include(productId);
    });

    it('[GET] get cart products succesfully', async () =>{
        const response = await requester.get(`/api/carts/${cartUserId}`);
        expect(response.statusCode).to.be.eql(200);
    })

    it('[PUT] update cart products quantity succesfully', async () =>{
        const response = await requester.put(`/api/carts/${cartUserId}/products/${productId}`).send({quantity:10});

        expect(response.statusCode).to.be.eql(200);
        const products = (await cartsService.getCartById(cartUserId)).products;
        const product = products.find((p)=>p.id_product.toString() === productId);

        expect(product.quantity).to.be.eql(10);
    })

    it('[DELETE] delete cart products succesfully', async () =>{
        const response = await requester.delete(`/api/carts/${cartUserId}`);
        expect(response.statusCode).to.be.eql(200);

        const products = (await cartsService.getCartById(cartUserId)).products;
        expect(products).to.be.eql([])
    })

})
