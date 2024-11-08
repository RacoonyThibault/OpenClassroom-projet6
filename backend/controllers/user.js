const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    const oldUser = User.findOne({ email: req.body.email })
    .then((oldUser) => {
      if (oldUser) {
        return res.status(409).json({ message: 'There was an error' });
      } else {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        User.findOne({ email: req.body.email })
        .then(testUser => {
            if (testUser) {
            return res.status(401).json({ message: 'Cet email est déjà utilisé !' });
            }
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
})}})
};

exports.login = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
        if (!user){
            res.status(401).json({ error: 'paire utilisateur/mot de passe incorrecte !' });
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid){
                    res.status(401).json({ error: 'paire utilisateur/mot de passe incorrecte !' });
                }else{
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => {res.status(408).json({ error });
        });
    }
};