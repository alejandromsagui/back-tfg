const { Transaction } = require("../models/transactionModel")
const axios = require("axios");
require('dotenv').config({ path: '.env' });


// /capture-order?token=9RN51516J7574384P&PayerID=QSFLPRYQQYEZ6
//La url retorna eso, el token es el ID de la transacción aprobada (el usuario le dio a aceptar), 
const createOrder = async (req, res) => {

    try {

        //Este objeto despues hay que configurarlo. Tengo que recibir un objeto del front con los datos de lo que quiere comprar el cliente, precio...
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "EUR",
                        value: "10"
                    },
                    description: "Recarga de Namekoins"
                }
            ],
            application_context: {
                brand_name: "namekiansgames.herokuapp.com",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: `${process.env.HOST}/capture-order`,
                cancel_url: `${process.env.HOST}/cancel-order`
            }
        }

        const params = new URLSearchParams()
        params.append("grant_type", "client_credentials")

        const { data: { access_token } } = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', params, {

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: process.env.CLIENT_ID,
                password: process.env.SECRET_KEY
            }
        })

        const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        res.json(response.data);

    } catch (error) {
        return res.status(500).send("Algo fue a la hora de crear el pedido")
    }
};

const captureOrder = async (req, res) => {

    const { token } = req.query
    console.log(token);
    res.send('Capturando la compra')

    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: process.env.CLIENT_ID,
            password: process.env.SECRET_KEY
        }
    })

    //Falta añadir interfaz 
    console.log(response.data);
}

const cancelOrder = (req, res) => {
    res.redirect("https://namekiansgames.herokuapp.com") 
}

module.exports = { createOrder, captureOrder, cancelOrder };