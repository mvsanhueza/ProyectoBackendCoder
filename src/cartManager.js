import {promises as fs} from 'fs';
import ProductManager from './productManager.js';

const productManager = new ProductManager('./products.json');

class CartManager{
    constructor(path){
        this.path = path;
    }

    async addCart(){
        
        const cartJSON = await fs.readFile(this.path, 'utf-8');
        const carts = JSON.parse(cartJSON);

        let idMax = carts.reduce((max, p) => p.id > max ? p.id : max, 0);
        const cart = {
            id: idMax + 1,
            products:[]
        };

        carts.push(cart);

        //Se guarda el carrito creado:
        await fs.writeFile(this.path, JSON.stringify(carts));
        return "Carrito creado";
    }

    async getCartById(id){
        const cartJSON = await fs.readFile(this.path, 'utf-8');
        const carts = JSON.parse(cartJSON);
        let idInt = parseInt(id);

        const cart = carts.find(c => c.id === idInt);
        if(cart){
            return cart;
        }
        else{
            console.log("NOT FOUND");            
        }
    }

    async updateCart(id, products){
        const cartJSON = await fs.readFile(this.path, 'utf-8');
        const carts = JSON.parse(cartJSON);

        let idInt = parseInt(id);

        const cart = carts.find(c => c.id === idInt);
        if(cart){
            cart.products = products;
        }
        else{
            console.log("NOT FOUND");            
        }

        await fs.writeFile(this.path, JSON.stringify(carts));
    }
    async addProductToCart(cid, pid, quantity){
        const cart = await this.getCartById(cid);
        if(!cart){
            return "Carrito no encontrado";
        }
        const product = await productManager.getProductById(pid);
        if(!product){
            return "Producto no encontrado";
        }

        //Si existe el carrito y el producto se analiza que si el carrito contiene el producto o no:
        const productCart = cart.products.find(p=>p.product == product.id);

        let cantidad = parseInt(quantity) || 1;

        if(productCart){
            productCart.quantity += cantidad;
        }
        else{
            cart.products.push({product: product.id, quantity: cantidad});
        }

        //Se guarda el carrito modificado:
        await this.updateCart(cart.id, cart.products);
        return "Producto agregado al carrito";
    }


    static incrementarId(){
        console.log(this.IncrementarID);
        if(this.IncrementarID){
            this.IncrementarID++;
        }
        else{
            this.IncrementarID = 1;
        }

        return this.IncrementarID;
    }
}

export default CartManager;