const puppeteer = require("puppeteer");
const transactionController = require("../controllers/transactionController")
const path = require("path");
const fs = require("fs");
const downloadsFolder = require("downloads-folder");
const axios = require("axios")

const exportData = async (req, res) => {
    const type = ''
    const transactions = await axios.get(`/findTransaction/${req.user.nickname}`)

    console.log(transactions.videogame);
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Factura Mensual</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
  
      h1 {
        text-align: center;
      }
  
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
  
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
  
      th {
        background-color: #C62828;
        color: #fff !important;
      }
      
    </style>
  </head>
  <body>
    <div style="display: flex; align-items: center;">
      <img src="https://storage.googleapis.com/namekiansgames/Logo/logo.png" alt="Logo" style="width: 15%; height: auto; vertical-align: sub; margin-right: 20px; display: inline-block;">
      <h4 style="font-size: 18px; display: inline-block; margin-bottom: 15px !important; margin-left: 10px;">Gracias por comprar en Namekians<span style="color: #C62828;">Games</span></h4>
    </div>
  
    <h1 style="text-align: center; margin-top: 20px;">Factura mensual</h1>
  
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Tipo de operación</th>
          <th>Precio</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>01/05/2023</td>
          <td>Compra de producto A</td>
          <td>Compra</td>
          <td>$100.00</td>
        </tr>
        <tr>
          <td>05/05/2023</td>
          <td>Compra de producto B</td>
          <td>Compra</td>
          <td>$150.00</td>
        </tr>
        <tr>
          <td>10/05/2023</td>
          <td>Venta de producto C</td>
          <td>Venta</td>
          <td>$200.00</td>
        </tr>
        <tr>
          <td>15/05/2023</td>
          <td>Compra de producto D</td>
          <td>Compra</td>
          <td>$80.00</td>
        </tr>
        <tr>
          <td>20/05/2023</td>
          <td>Venta de producto E</td>
          <td>Venta</td>
          <td>$300.00</td>
        </tr>
      </tbody>
    </table>
    <sub style="margin-top: 50px !important;">Atentamente, el equipo de Namekians<span style="color: #C62828;">Games</span></sub>
  </body>
  </html>
`  

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Configurar el contenido HTML de la página
  await page.setContent(htmlContent);

  // Generar el nombre de archivo y la ruta
  const fileName = "transacciones.pdf";
  let filePath = path.join(downloadsFolder(), fileName);
  let counter = 1;

  // Verificar y modificar el nombre de archivo si ya existe
  while (fs.existsSync(filePath)) {
    const baseName = path.basename(fileName, path.extname(fileName));
    const newName = `${baseName}(${counter})${path.extname(fileName)}`;
    filePath = path.join(downloadsFolder(), newName);
    counter++;
  }

  // Guardar el archivo PDF en la carpeta de descargas del usuario
  await page.pdf({ path: filePath, format: "A4", printBackground: true, preferCSSPageSize: true});

  await browser.close();
};

module.exports = exportData;
