const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();
const { access_token, email } = require("./config");

MercadoPago.configure({
  sandbox: true,
  access_token,
});

app.get("/", (req, res) => {
  MercadoPago.payment
    .search({
      //qs: filters
    })
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.get("/pagar", async (req, res) => {
  // Pagamentos

  // id // codigo // pagador // status
  // 1 // 1593163315787 // victordevtb@gmail.com  // Não foi pago
  // 2 //  1593163315782 // victordevtb2@gmail.com // Pago

  const id = `${Date.now()}`;

  const dados = {
    items: [
      (item = {
        id,
        title: "2x video games;3x camisas",
        quantity: 1,
        currency_id: "BRL",
        unit_price: parseFloat(150),
      }),
    ],
    payer: {
      email,
    },
    external_reference: id,
  };

  try {
    const pagamento = await MercadoPago.preferences.create(dados);
    //Banco.SalvarPagamento({id: id, pagador: emailDoPagador});
    return res.redirect(pagamento.body.init_point);
  } catch (err) {
    return res.send(err.message);
  }
});

app.post("/not", (req, res) => {
  const id = req.query.id;

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
