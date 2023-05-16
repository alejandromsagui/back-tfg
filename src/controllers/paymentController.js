const recharge = require("../models/rechargeModel")
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
                        value: req.body.quantity
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
        return res.status(500).send("Algo fue mal a la hora de crear el pedido")
    }
};

const captureOrder = async (req, res) => {

    try {
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
    console.log('Petición capturada');

    console.log('Valor de req.user desde compra aceptada: '+req.user);
    const newRecharge = {
        quantity: req.body.quantity,
        date: new Date().toLocaleString("es-ES"),
        userId: req.user.id,
        nickname: req.user.nickname
      };

      const recharge = await recharge.create(newRecharge);

      return res.status(200).json({
        message: 'Nueva recarga realizada',
        recharge
      })
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error al realizar la recarga', error })
    } finally {
        
    }
}

const cancelOrder = (req, res) => {
    res.redirect("https://namekiansgames.herokuapp.com") 
}

const getRecharges = async (req, res) => {
    try {
        const recharges = await recharge.find();

        res.status(200).json({
            status: 'ok',
            recharges
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error al ver las recargas',
        });
    }
}
module.exports = { createOrder, captureOrder, cancelOrder, getRecharges };