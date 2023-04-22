import { promises as fs } from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const keysRequired = ["title", "description", "code", "price", "status", "stock"];
        const keysProduct = Object.keys(product);

        //se lee el archivo txt con los datos:
        const productsJSON = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsJSON);

        if (keysRequired.some(k => !keysProduct.includes(k))) {
            return "Producto inválido";
        }
        else if (products.find(p => p.code == product.code)) {
            return "Producto existente";
        }

        product.id = ProductManager.incrementarID();
        products.push(product);

        //Se guarda el nuevo producto en el archivo txt:
        await fs.writeFile(this.path, JSON.stringify(products));
        return "Producto creado";
    }

    async getProducts() {
        const productsJSON = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsJSON);
        return products;
    }

    async getProductById(id) {
        const productsJSON = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsJSON);

        let idInt = parseInt(id);

        const product = products.find(p => p.id == idInt);
        if (product) {
            return product;
        }
        else {
            console.log("Not Found");
            return;
        }
    }

    async updateProduct(id, { title, description, code, price, status, stock, category, thumbnails }) {
        const productsJSON = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsJSON);

        let idInt = parseInt(id);
        const product = products.find(p => p.id === idInt);
        if (product) {
            product.title = title;
            product.description = description;
            product.code = code;
            product.price = price;
            product.status = status;
            product.stock = stock;
            product.category = category;
            product.thumbnails = thumbnails;

            //Se vuelve a guardar en el archivo:
            await fs.writeFile(this.path, JSON.stringify(products));
            return "Producto actualizado";
        }
        else {
            return "Producto no encontrado"
        }
    }

    async deleteProduct(id) {
        let idInt = parseInt(id);

        const productsJSON = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsJSON);

        const product = products.find(p => p.id === idInt);

        if (product) {
            const productsNew = products.filter(p => p.id != idInt);
            //Se actualiza el txt:
            await fs.writeFile(this.path, JSON.stringify(productsNew));
            return "Producto eliminado";
        }
        else {
            return "Producto no encontrado"
        }
    }

    static incrementarID() {
        console.log(this.incrementarId);
        if (this.incrementarId) {
            this.incrementarId++;
        }
        else {
            this.incrementarId = 1;
        }

        return this.incrementarId;
    }

}

export default ProductManager