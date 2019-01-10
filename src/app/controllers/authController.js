const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params , authConfig.secret, {
        expiresIn: 86400, 
     });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })){
            return res.status(400).send({
                message : 'error: user already exists'
            });
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });

    } catch (err) {
        return res.status(400).send({ message: "error -> " + err });
    }
});

router.post('/authenticate', async (req, res) => {
  try{
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user){
        return res.status(400).send({
            message: 'error: user not found'
        });
    }

    if (!await bcrypt.compare(password, user.password)){
        return res.status(400).send({
            message: 'error: invalid password'
        });
    }

    user.password = undefined;

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
       expiresIn: 86400, 
    });

    res.send({ 
        user,
        token: generateToken({ id: user.id }), 
    });
    
  } catch (err){
    return res.status(400).send({ message: "error -> " + err });
  }

});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user)
        return res.status(400).send({ message: 'error: user not found' });
  
      const token = crypto.randomBytes(20).toString('hex');
  
      const now = new Date();
      now.setHours(now.getHours() + 1);
  
      await User.findByIdAndUpdate(user.id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now,
        }
      });
  
      mailer.sendMail({
        to: email,
        from: 'diego@rocketseat.com.br',
        template: 'auth/forgot-password',
        context: { token },
      }, (err) => {
        if (err)
          return res.status(400).send({ message: 'error: cannot send forgot password email' });
  
        return res.send({ send: true });
      })
    } catch (err) {
      res.status(400).send({ message: 'error: ' + err });
    }
  });
  
  router.post('/reset-password', async (req, res) => {
    const { email, token, password } = req.body;
  
    try {
      const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires');
  
      if (!user)
        return res.status(400).send({ message: 'error: user not found' });
  
      if (token !== user.passwordResetToken)
        return res.status(400).send({ message: 'error: token invalid' });
  
      const now = new Date();
  
      if (now > user.passwordResetExpires)
        return res.status(400).send({ message: 'error: token expired, generate a new one' });
  
      user.password = password;
  
      await user.save();
  
      res.send({ update: true });
    } catch (err) {
      res.status(400).send({ message: 'error: ' + err });
    }
  });

module.exports = app => app.use('/auth', router);