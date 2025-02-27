const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require("./controllers/register.js");
const signIn = require("./controllers/signIn.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'facerecogbrain'
    },
    searchPath: ['knex', 'public']
});


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('/profile/:id', profile.profile(db));
app.get('/', (req, res) => res.json());
app.get('/profile', (req, res) => res.send('getting profile'));
app.post('/signIn', signIn.signIn(db, bcrypt));
app.post('/register', register.register(db, bcrypt));
app.put('/image', image.image(db));
app.post('/imageUrl', (req, res) => image.url(req, res));
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));