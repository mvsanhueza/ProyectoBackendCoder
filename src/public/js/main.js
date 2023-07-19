//Socket:
const socket = io();


//Se busca el formulario y se le agrega el eventlistener:
// const formProduct = document.getElementById('form_Product');
// const divProductContainer = document.getElementById('productsContainer')
// if(formProduct){
//     //Se define el EventListener:   
//     formProduct.addEventListener('submit', (e)=>{
//         e.preventDefault();
//         const productData = new FormData(e.target); //Transforma objeto htm en objeto iterator



    
//         const productString = Object.fromEntries(productData); //Transforma objeto iterator en objeto js
//         //Se ajusta el valor de status (true o false) y se agrega el thumbnail, y precio a numero:
//         const product = {
//             title: productString.title,
//             description: productString.description,
//             code: productString.code,
//             price: parseFloat(productString.price),
//             status: productString.status === 'on',
//             stock: parseInt(productString.stock),
//             category: productString.category,
//             thumbnails: productString.thumbnails.split(',')
//         };
    
        
//         socket.emit('addProduct', product);
//         formProduct.reset();
//     })
//     }
//     const socket = io();

//     socket.on('actProducts', (products)=>{
//     divProductContainer.innerHTML = '';
//     products.forEach(product => {
//         divProductContainer.innerHTML += `<div id=${product.id}>
//         <button onclick="borrarProducto_Click(${product.id})" class="deleteProduct_button"><i class="bi bi-trash"></i></button>
//         <p class="productTitle"><strong>${product.title}</strong></p>        
//         <p><strong>Descripción: </strong>${product.description}</p>
//         <p><strong>Code: </strong>${product.code}</p>
//         <p><strong>Precio: </strong>${product.price}</p>
//         <p><strong>Estado: </strong>${product.status}</p>
//         <p><strong>Stock: </strong>${product.stock}</p>
//         <p><strong>Categoría: </strong>${product.category}</p>
//     </div>`

//     })
// })

// function borrarProducto_Click(id){
//     socket.emit('deleteProduct', id);
// }


async function addToCart_Click(btn) {
    //Se utiliza le id del carrito ya creado en mongoose, al no poder almacenar el id de un carrito nuevo:
    const cartId = "64756f902b38f27b6ab69f65";

    //Se agrega el producto al carrito:
    try{        
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${btn.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        
        console.log('Producto agregado');
    }
    catch (err){
        console.log("Error al agregar al carrito: ", err);
    }
    
}

async function sendMessage_Click(){
    const response = await fetch('http://localhost:8080/api/sessions/current');
    const user = await response.json();

    const input = document.getElementById('message');
    const message = input.value;

    if(message.trim().length > 0){
        socket.emit('client:messageSent', {user: user.email, message: message});
        input.value = '';
    }
}

//Si se encuentra en el chat, se prenden los sockets:
if(window.location.href.includes('chat')){

    const divMensajes = document.getElementById('divMessages');

    //Para leer los mensajes:
    socket.on('server:messageStored', (messages) => {
        loadMessages(messages);
    })
    socket.on('server:LoadMessages', (messages) => {
        loadMessages(messages);
    })

    const loadMessages = async (messages) =>{
        divMensajes.innerHTML = '';
        //Se identifica al usuario:
        messages.forEach(message =>{
            const date = new Date(message.date);
            const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            divMensajes.innerHTML += `<p class="message"> <strong>${message.user}</strong>: ${message.message} <br> ${dateString} <br><br> </p>`;
        })        
    }

    socket.emit('client:LoadMessages');
}