const socket = io();

//Se busca el formulario y se le agrega el eventlistener:
const formProduct = document.getElementById('form_Product');
const divProductContainer = document.getElementById('productsContainer')
if(formProduct){
    //Se define el EventListener:   
    formProduct.addEventListener('submit', (e)=>{
        e.preventDefault();
        const productData = new FormData(e.target); //Transforma objeto htm en objeto iterator
    
        const productString = Object.fromEntries(productData); //Transforma objeto iterator en objeto js
        //Se ajusta el valor de status (true o false) y se agrega el thumbnail, y precio a numero:
        const product = {
            title: productString.title,
            description: productString.description,
            code: productString.code,
            price: parseFloat(productString.price),
            status: productString.status === 'on',
            stock: parseInt(productString.stock),
            category: productString.category,
            thumbnails: productString.thumbnails.split(',')
        };
    
        
        socket.emit('addProduct', product);
        formProduct.reset();
    })
    }

socket.on('actProducts', (products)=>{
    divProductContainer.innerHTML = '';
    products.forEach(product => {
        divProductContainer.innerHTML += `<div id=${product.id}>
        <button onclick="borrarProducto_Click(${product.id})" class="deleteProduct_button"><i class="bi bi-trash"></i></button>
        <p class="productTitle"><strong>${product.title}</strong></p>        
        <p><strong>Descripción: </strong>${product.description}</p>
        <p><strong>Code: </strong>${product.code}</p>
        <p><strong>Precio: </strong>${product.price}</p>
        <p><strong>Estado: </strong>${product.status}</p>
        <p><strong>Stock: </strong>${product.stock}</p>
        <p><strong>Categoría: </strong>${product.category}</p>
    </div>`

    })
})

function borrarProducto_Click(id){
    socket.emit('deleteProduct', id);
}