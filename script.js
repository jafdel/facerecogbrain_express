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
        connectionString: 'postgresql://jafdel:kH5KAQ15Ic8zXZHaUsdHGh3zj5JuwQGG@dpg-cv0v2kfnoe9s73eges0g-a.virginia-postgres.render.com/facerecogbrain?ssl=true'
    },
});


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('/profile/:id', profile.profile(db));
app.get('/', (req, res) => res.json('It is working!'));
app.get('/profile', (req, res) => res.send('getting profile'));
app.post('/signIn', signIn.signIn(db, bcrypt));
app.post('/register', register.register(db, bcrypt));
app.put('/image', image.image(db));
app.post('/imageUrl', (req, res) => image.url(req, res));
app.listen(process.env.PORT || 3000, () => console.log(`Server is listening on port ${process.env.PORT}`));