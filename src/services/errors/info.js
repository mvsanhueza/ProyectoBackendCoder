export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades del producto no son válidas.
    Las propiedades requeridas son:
    title      : tipo String, recibe ${product.title},
    description : tipo String, recibe ${product.description},
    code      : tipo String, recibe ${product.code},
    category   : tipo String, recibe ${product.category},
    price      : tipo Number, recibe ${product.price},
    stock       : tipo Number, recibe ${product.stock},`
}


export const generateCartNotFoundErrorInfo = (cid) => {
    return `No se encontro el carrito con el ID ingresado.
    El ID ingresado fue: ${cid}`
}

export const generateProductNotFoundErrorInfo = (pid) => {
    return `No se encontro el producto con el ID ingresado.
    El ID ingresado fue: ${pid}`
}

export const generateUpdateCartProductsErrorInfo = "No se han ingresado los productos correctamente";

export const generateQuantityParameterNotFoundError = "No se ha ingresado el parámetro 'quantity'";

export const generateProductNotFoundInCartErrorInfo = (cid, pid) => {
    return `No se encontro el producto con el ID ${pid} ingresado en el carrito con el ID ${cid} ingresado`;
} 
export const generateUserUpdateError = `Link de recuperación incorrecto o expirado`;
