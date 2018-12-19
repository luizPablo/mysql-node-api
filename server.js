const express = require('express');
const cors = require('cors');

//Iniciando o App
const app = express();
app.use(express.json());
app.use(cors());

//Sincronizando com o banco de dados
const models = require('./models');
models.sequelize.sync().then(function(){
    console.log('Database is work fine!');
}).catch(function(err){
    console.log(err, "Somethin wrong! :(");
});

//Rotas
app.use('/api', require('./routes'));

//Rodando na porta 3002
app.listen(3002);