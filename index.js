const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();

MercadoPago.configure({
  sandbox: true,
  access_token:
    "TEST-6444911303132115-080819-211d97db361dcb2a6d1d651683a8bd5e-209776910",
});

app.get("/", (req, res) => {
  res.send(`Olá mundo! ${Date.now()}`);
});

const id = `${Date.now()}`;
const emailDoPagador = "vitor.brother17@gmail.com";

app.get("/pagar", async (req, res) => {
  const dados = {
    items: [
      (item = {
        id: id, // UUID && Data
        title: "2x Video games",
        quantity: 1,
        currency_id: "BRL",
        unit_price: parseFloat(150),
      }),
    ],
    payer: {
      email: emailDoPagador,
    },
    external_references: id,
  };
  try {
    const pagamento = await MercadoPago.preferences.create(dados);
    console.log(pagamento);
    return res.redirect(pagamento.body.init_point);
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
});

app.post("/not", (req, res) => {
  console.log(req.query);
  res.send("OK");
});

app.listen(80, (req, res) => {
  console.log("Servidor rodando!");
});
