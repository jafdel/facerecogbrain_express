const register = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        console.log("Error!");
        return res.status(400).json("Invalid form input");
    } else {
        const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx('login').returning('email').insert({
                hash: hash,
                email: email
            }).then(loginEmail => {
                console.log(loginEmail[0].email);
                return trx('users').returning('*').insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                }).then(user => res.json(user[0]));
            }).then(trx.commit).catch(trx.rollback)
        }).then(user => res.json(user[0])).catch(err => res.status(400).json("Unable to register"));
    }
};

module.exports = {
    register: register
};