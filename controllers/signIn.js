const signIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    console.log('Start');
    if (!email || !password) {
        console.log("Error!");
        res.status(400).json("Invalid form input");
    } else {
        db.select('*').from('login').where('email', '=', email)
        .then(data => {
            if (data.length) {
                if (bcrypt.compareSync(password, data[0].hash)) {
                    console.log(data);
                    return db.select('*').from('users').where('email', '=', email)
                    .then(user => res.json(user[0]));
                } else {
                    res.status(400).json('Password does not match');
                }
            } else {
                res.status(400).json('Email address does not exist');
            }
        });
    }
};

module.exports = {
    signIn: signIn
};