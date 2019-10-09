const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);



mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Nao e o melhor formato para servidor procurar por radius
const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

// GET - Buscar info do backend
// POST - Cadastro de usuário
// PUT - Editar alguma info
// DELETE - Deletar alguma info

// req.query = acessar query params (para filtros)
// req.params = acessar route params (para edicao e delete)
// req.body = acessar corpo da requisicao (para criacao e edicao)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads' )));
app.use(routes);

server.listen(process.env.PORT || 3333, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  } );

