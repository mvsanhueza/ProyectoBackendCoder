//Socket:
const socket = io();

if (window.location.href.includes('realTimeProducts')) {
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


            socket.emit('client:addProduct', product);
            formProduct.reset();
        })
        }
        const socket = io();

        socket.on('server:actProducts', (products)=>{
        divProductContainer.innerHTML = '';
        products.forEach(product => {
            divProductContainer.innerHTML += `<div id=${product._id.toString()}>
            <button onclick="borrarProducto_Click('${product._id.toString()}')" class="deleteProduct_button"><i class="bi bi-trash"></i></button>
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
        console.log(id);
        socket.emit('client:deleteProduct', id);
    }
}

const getCurrentUser = async () => {
    try {
        const responseUser = await fetch('/api/sessions/current');
        const user = await responseUser.json();
        return user;
    }
    catch {
        return null;
    }
}
async function goToCart_Click() {
    //Se busca el id del cart del usuario:
    try {
        const user = await getCurrentUser();
        const cartId = user.cart.id_cart;
        window.location.href = `/api/carts/${cartId}`;
    }
    catch (error) {
        console.log({ error: error });
    }
}

async function borrarCartProduct_Click(pid){
    try{
        const user = await getCurrentUser();
        const cid = user.cart.id_cart;
        console.log(pid);
        const response = await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'DELETE' })
        location.reload();
    }
    catch(error){
        console.log({error:error});
    }
}

async function addToCart_Click(btn) {
    //Se utiliza le id del carrito ya creado en mongoose, al no poder almacenar el id de un carrito nuevo:  
    //Se agrega el producto al carrito:
    try {
        //Primero se crea el carrito en caso de que no existe en la session:

        const user = await getCurrentUser();

        //SE busca el cartId del usuario:
        const cartId = user.cart.id_cart;

        const response = await fetch(`/api/carts/${cartId}/products/${btn.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        console.log('Producto agregado');
    }
    catch (err) {
        console.log("Error al agregar al carrito: ", err);
    }

}

async function sendMessage_Click() {
    const user = await getCurrentUser();

    const input = document.getElementById('message');
    const message = input.value;

    if (message.trim().length > 0) {
        socket.emit('client:messageSent', { user: user.email, message: message });
        input.value = '';
    }
}

//Si se encuentra en el chat, se prenden los sockets:
if (window.location.href.includes('chat')) {

    const divMensajes = document.getElementById('divMessages');

    //Para leer los mensajes:
    socket.on('server:messageStored', (messages) => {
        loadMessages(messages);
    })
    socket.on('server:LoadMessages', (messages) => {
        loadMessages(messages);
    })

    const loadMessages = async (messages) => {
        divMensajes.innerHTML = '';
        //Se identifica al usuario:
        messages.forEach(message => {
            const date = new Date(message.date);
            const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            divMensajes.innerHTML += `<p class="message"> <strong>${message.user}</strong>: ${message.message} <br> ${dateString} <br><br> </p>`;
        })
    }

    socket.emit('client:LoadMessages');
}

async function purchaseCart_Click() {
    const user = await getCurrentUser();
    const cartId = user.cart.id_cart;

    window.location.href = `/api/carts/${cartId}/purchase`;
}

async function deleteUser_Click(uid) {
    console.log(uid);
    const responseUser = await fetch(`/api/users/${uid}`, { method: 'DELETE' });
    location.reload();
}
