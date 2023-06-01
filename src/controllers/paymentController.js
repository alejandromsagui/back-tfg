const rechargeModel = require("../models/rechargeModel")
const userModel = require("../models/usuarioModel")
const axios = require("axios");
require('dotenv').config({ path: '.env' });
var nickname = ''
var id = ''
var cantidad = null


// /capture-order?token=9RN51516J7574384P&PayerID=QSFLPRYQQYEZ6
//La url retorna eso, el token es el ID de la transacción aprobada (el usuario le dio a aceptar), 
const createOrder = async (req, res) => {
    cantidad = parseInt(req.body.quantity);
    nickname = req.user.nickname;
    id = req.user.id;
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

        console.log('La cantidad elegida es esta: ', cantidad);
        if (cantidad !== 10 && cantidad !== 25 && cantidad !== 40) {
            console.log('cantidad desde dentro: ', cantidad);
            return res.status(400).send({ message: 'Cantidad para recargar inválida' });
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

        res.send(response.data);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Algo fue mal a la hora de crear el pedido")
    }
};

const captureOrder = async (req, res) => {
    console.log('cantidad desde variable: '+cantidad);
    console.log('Estoy aqui');
    try {
        const { token } = req.query
        console.log(token);

        const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: process.env.CLIENT_ID,
                password: process.env.SECRET_KEY
            }
        })

        //Falta añadir interfaz 
        console.log(response.data);
        console.log('Petición capturada');

        console.log('Valor de req.user desde compra aceptada: ' + nickname);
        console.log('Valor de cantidad antes recarga: ', cantidad);

        const newRecharge = {
            quantity: cantidad,
            date: new Date().toLocaleString("es-ES"),
            userId: id,
            nickname: nickname
        };

        console.log('Valor de recarga en newRecarge: ', newRecharge.quantity);

        // if(newRecharge.cantidad !== 10 || newRecharge.cantidad !== 25 || newRecharge.cantidad !== 40){
        //     return res.status(400).send({ message: 'Cantidad inválida'})
        // }

        const recharge = await rechargeModel.create(newRecharge);


        //Esto hay que cambiarlo. Realizar la operación aquí dentro
        // const user = await axios.get(`${process.env.HOST}/getUser/${nickname}`)
        // console.log('Petición de user en paypal: ', user.data);

        const user = await userModel.findById({ _id: id})
        let namekoins = user.number_namekoins

        console.log('Namekoins antes de la suma: '+namekoins);
        namekoins = namekoins + (cantidad * 10)
        console.log('Namekoins despues de la suma: '+namekoins);

        await userModel.updateOne({ _id: id}, { number_namekoins: namekoins})
        res.redirect('https://namekiansgames.herokuapp.com/')
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Ha ocurrido un error al realizar la recarga', error })
    }
}

const cancelOrder = (req, res) => {
    res.redirect("https://namekiansgames.herokuapp.com")
}

const getRecharges = async (req, res) => {
    try {
        const recharges = await rechargeModel.find();

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