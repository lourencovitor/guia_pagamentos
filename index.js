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
    return res.redirect(pagamento.body.init_point);
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
});

app.post("/not", (req, res) => {
  const { id } = req.body;
  setTimeout(() => {
    const filtro = {
      "order.id": id,
    };

    MercadoPago.payment
      .search({
        qs: filtro,
      })
      .then((data) => {
        const pagamento = data.body.results[0];

        if (pagamento != undefined) {
          console.log(pagamento.external_reference);
          console.log(pagamento.status); // approved
        } else {
          console.log("Pagamento não existe!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, 20000);

  res.send("OK");
});

app.listen(80, (req, res) => {
  console.log("Servidor rodando!");
});
