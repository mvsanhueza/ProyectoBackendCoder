import productsService from "../services/products.service.js";


export const getProducts = async (req, res) => {
    const result = {
        status: "error",
        payload: [],
        totalPages: 0,
        prevPage: 0,
        nextPage: 0,
        page: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevLink: null,
        nextLink: null,
    }

    try {
        let { limit, page, sort, query } = req.query;
        //Se asignan los valores para la lectura:
        const products = await productsService.getPageProducts(query, limit, page, sort);

        result.status = "success";
        result.payload = products.docs;
        result.totalPages = products.totalPages;
        result.prevPage = products.prevPage;
        result.nextPage = products.nextPage;
        result.hasPrevPage = products.hasPrevPage;
        result.hasNextPage = products.hasNextPage;
        result.page = intPage;

        //Se busca el prevlink y el nextling según corresponda:
        let linkAddOptions = (limit ? (`&limit=${limit}`) : "") + (sort ? (`&sort=${sort}`) : "") + (query ? (`&query=${query}`) : "");
        result.prevLink = products.hasPrevPage ? (`http://localhost:8080/api/products?page=${products.prevPage}` + linkAddOptions) : null;
        result.nextLink = products.hasNextPage ? (`http://localhost:8080/api/products?page=${products.nextPage}` + linkAddOptions) : null;
    }
    catch {
    }
    res.render('home', { session: req.user, result: result });
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await productsService.getProductById(id);
    if (product) {
        res.render('home', { products: [product] });
    }
    else {
        res.send({ error: "No se encontro el producto con el ID ingresado" })
    }
}

export const createProduct = async (req, res) => {
    const newProduct = await productsService.createProduct(req.body);

    // const mensaje = await productManager.addProduct({title, description,code,price,status,stock,category,thumbnails});
    if (newProduct) {
        res.send("Objeto agregado");
    }
    else {
        res.send("No se pudo agregar el objeto");
    }
}

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const mensaje = await productsService.updateProduct(id, { title, description, code, price, status, stock, category, thumbnails });
    res.send(mensaje);
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const mensaje = await productsService.deleteProduct(id);
    res.send(mensaje);
}
