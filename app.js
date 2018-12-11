// var senderAdmin = 'smtps://descubriendoelcaribecun%40gmail.com' // The emailto use in sending the email
var express = require('express');
var app = express();
bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
// var EmailTemplate = require('email-templates').EmailTemplate;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


var senderAdmin = 'descubriendoelcaribecun@gmail.com';
var passwordAdmin = 'D3scubriendo2018'; // passwordAdmin of the email to use

app.get('/test', function (req, res) {
  res.send('Email enviado');
});


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderAdmin,
    pass: passwordAdmin
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.post('/sendEmail', function (req, res) {
  console.log(req.body);
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  const mailOptions = {
    from: senderAdmin, // senderAdmin address
    to: email,//'amadojms@gmail.com', // list of receivers
    subject: name+' gracias por tu preferencia. en unos momentos nos pondremos en contacto contigo', // Subject line
    html: '<h3>Gracias por contactarnos!<small>Descubriendo el caribe</small></h3><br><p>Nos pondremos en contacto contigo, al numero '+phone+' lo mas pronto posible.</p>' // plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err){
      var response = {
        status:false,
        message:"Mensaje no se ha podido enviar, te contactaremos de todos modos.",
        error: err
      };
      res.send(response);
    }else{
      var response = {
        status:true,
        message:"Mensaje ha sido enviado",
        info:info
      };
      res.send(response);
    }
  });
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});