const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const multerConfig = require("./config/multer");
// const http = require("http");
// const path = require("path");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

function TestaCPF(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == "00000000000") return true;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

app.post("/sendEmail", multer(multerConfig).single("file"), (req, res) => {
  const { nomecompleto, email, telefone, cpf, cargo } = req.body;
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  try {
    if (!emailRegexp.test(email)) {
      return res.status(400).json({ error: "Email inválido", email: email });
    }

    if (!TestaCPF(cpf)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "corretorajle2@gmail.com",
        pass: "@Jle2123"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let emailASerEnviado = {
      from: 'JL Corretora <corretorajle2@gmail.com>',
      to: 'contato@jle2corretora.com',
      subject: 'Curriculo ' + nomecompleto,
      text: 'Curriculo chegando...',
      attachments: [{
        filename: cpf + '-' + nomecompleto.replace(" ", "-") + '-' + 'Curriculo.pdf',
        path: 'tmp/uploads/' + cpf + '-' + nomecompleto.replace(" ", "-") + '-' + 'Curriculo.pdf'
      }],
      html: '<h3>Nome Completo: ' + nomecompleto + '</h3>' +
        '<h3>Email: ' + email + '</h3>' +
        '<h3>Telefone: ' + telefone + '</h3>' +
        '<h3>CPF: ' + cpf + '</h3>' +
        '<h3>Cargo: ' + cargo + '</h3>'+
        
         //Assinatura Email
         '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
         '<tr>'+
           '<td><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
             '<tr>'+
               '<td><font face="Calibri" color="#a30d1d" style="font-size:14px"><b>JL CORRETORA E ADMINSTRADORA DE SEGUROS</b></font></td>'+
             '</tr>'+
             '<tr>'+
               '<td height="20"><font face="Calibri" color="#565656" style="font-size:14px">Rua Bandeirantes Nº 273 - Centro, Palmares Paulista(SP)</font></td>'+
             '</tr>'+
             '<tr>'+
               '<td height="20"><font face="Calibri" color="#565656" style="font-size:14px">Avenida Segismundo Novais Nº 208 - Centro, Planura(MG)</font></td>'+
             '</tr>'+
            '<tr>'+
               '<td height="20"><font face="Calibri" color="#a30d1d" style="font-size:14px">contato@jle.com</font></td>'+
             '</tr>'  +
             '<tr>'+
               '<td height="40"><font face="Calibri" color="#a30d1d" style="font-size:14px">www.jle2corretora.com | Redes Sociais: @jl_corretora | facebook.com/corretoraJL</font></td>'+
             '</tr>'+
             '<tr>'+	  
               '<td><img src="http://www.jle2corretora.com/wp-content/uploads/2019/08/logo.png" border="0" style="display:block;"></td>'+
             '</tr>'+
             '<tr>'+
               '<td height="30"></td>'+
             '</tr>'+
           '</table></td>'+
         '</tr>'+
       '</table>'
    };

    transporter.sendMail(emailASerEnviado)
      .then(message => {
        console.log(message);
      }).catch(err => {
        console.log(err);
      });
      
    return res.status(200).json([
      {
        message: "Email enviado com sucesso!"
      },
      {
        body: req.body
      }
    ]);

  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

app.post("/sendContact", cors(), (req, res, next) => {
  const { nomecompleto, email, telefone, mensagem} = req.body;

  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  try {
    if (!emailRegexp.test(email)) {
      return res.status(400).json({ error: "Email inválido", email: email });
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "corretorajle2@gmail.com",
        pass: "@Jle2123"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let emailASerEnviado = {
      from: 'JL Corretora <corretorajle2@gmail.com>',
      to: 'contato@jle2corretora.com',
      subject: 'Alguém com o nome: ' + nomecompleto + ' está entrando em contato com a JL Corretora',
      text: 'Email de contato chegando...',

      html: '<h3>Nome: ' + nomecompleto + '</h3>' +
        '<h3>Email: ' + email + '</h3>' +
        '<h3>Telefone: ' + telefone + '</h3>' +
        '<h3>Mensagem: ' + mensagem + '</h3>' + 

        //Assinatura Email
        '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
        '<tr>'+
          '<td><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
            '<tr>'+
              '<td><font face="Calibri" color="#a30d1d" style="font-size:14px"><b>JL CORRETORA E ADMINSTRADORA DE SEGUROS</b></font></td>'+
            '</tr>'+
            '<tr>'+
              '<td height="20"><font face="Calibri" color="#565656" style="font-size:14px">Rua Bandeirantes Nº 273 - Centro, Palmares Paulista(SP)</font></td>'+
            '</tr>'+
            '<tr>'+
              '<td height="20"><font face="Calibri" color="#565656" style="font-size:14px">Avenida Segismundo Novais Nº 208 - Centro, Planura(MG)</font></td>'+
            '</tr>'+
          '<tr>'+
              '<td height="20"><font face="Calibri" color="#a30d1d" style="font-size:14px">contato@jle.com</font></td>'+
            '</tr>'  +
            '<tr>'+
              '<td height="40"><font face="Calibri" color="#a30d1d" style="font-size:14px">www.jle2corretora.com | Redes Sociais: instagram.com/jl_corretora | facebook.com/corretoraJL</font></td>'+
            '</tr>'+
            '<tr>'+	  
              '<td><img src="http://www.jle2corretora.com/wp-content/uploads/2019/08/logo.png" border="0" style="display:block;"></td>'+
            '</tr>'+
            '<tr>'+
              '<td height="30"></td>'+
            '</tr>'+
          '</table></td>'+
        '</tr>'+
      '</table>'
    };

    transporter.sendMail(emailASerEnviado)
      .then(message => {
        console.log(message);
      }).catch(err => {
        console.log(err);
      });
      
    return res.status(200).json(
      {
        message: "Contactado com sucesso!"
      },
      {
        body: req.body
      }
    );

  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

app.post("/sendEmailConsorcio", cors(), (req, res, next) => {
  const { nome, cpf, telfixo, telcelular, email, consorcio, observacoes} = req.body;

  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  try {
    if (!emailRegexp.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    if (!TestaCPF(cpf)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "corretorajle2@gmail.com",
        pass: "@Jle2123"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let emailASerEnviado = {
      from: 'JL Corretora <corretorajle2@gmail.com>',
      to: 'contato@jle2corretora.com',
      subject: 'Nova simulação de consórcio',
      text: 'simulação de consórcio chegando...',

      html: '<h3>Nome: ' + nome + '</h3>' +
        '<h3>CPF: ' + cpf + '</h3>' +
        '<h3>Telefone Fixo: ' + telfixo + '</h3>' +
        '<h3>Telefone Celular: ' + telcelular + '</h3>' +
        '<h3>Email: ' + email + '</h3>' +
        '<h3>Consórcio: ' + consorcio + '</h3>' +
        '<h3>Observações: ' + observacoes + '</h3>'+

        //Assinatura Email
        '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
          '<tr>'+
            '<td><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
              '<tr>'+
                '<td><font face="Calibri" color="#a30d1d" style="font-size:14px"><b>JL CORRETORA E ADMINSTRADORA DE SEGUROS</b></font></td>'+
              '</tr>'+
              '<tr>'+
                '<td height="20"><font face="Calibri" color="#565656" style="font-size:14px">Rua Bandeirantes Nº 273 - Centro, Palmares Paulista(SP)</font></td>'+
              '</tr>'+
              '<tr>'+
                '<td height="20"><font face="Calibri" color="#565656" style="font-size:14px">Avenida Segismundo Novais Nº 208 - Centro, Planura(MG)</font></td>'+
              '</tr>'+
             '<tr>'+
                '<td height="20"><font face="Calibri" color="#a30d1d" style="font-size:14px">contato@jle.com</font></td>'+
              '</tr>'  +
              '<tr>'+
                '<td height="40"><font face="Calibri" color="#a30d1d" style="font-size:14px">www.jle2corretora.com | Redes Sociais: <img src= "">instagram.com/jl_corretora | facebook.com/corretoraJL</font></td>'+
              '</tr>'+
              '<tr>'+	  
                '<td><img src="http://www.jle2corretora.com/wp-content/uploads/2019/08/logo.png" border="0" style="display:block;"></td>'+
              '</tr>'+
              '<tr>'+
                '<td height="30"></td>'+
              '</tr>'+
            '</table></td>'+
          '</tr>'+
        '</table>'
    };

    transporter.sendMail(emailASerEnviado)
      .then(message => {
        console.log(message);
      }).catch(err => {
        console.log(err);
      });
    return res.status(200).json(
      {
        message: "Contactado com sucesso!"
      },
      {
        body: req.body
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("SERVIDOR INCIADO | PORTA: " + PORT);
});


