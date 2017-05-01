/* eslint-disable consistent-return */
import { Router } from 'express';
import User from '../core/models/UserModel';
import passport from '../core/passport';
import validator from 'validator';
import faker from 'faker';
import generatePassword from 'password-generator';
import Util from './util';
const router = new Router();
router.get('/', async (req, res) =>
  res.status(400).send({ msg: 'No support for Get on / ' }));

router.post('/login', passport.authenticate('local'), (req, res) =>
  res.json({ status: 'OK', user: req.user, avtaarUrl: faker.fake('{{internet.avatar}}') }));

router.post('/register', async (req, res, next) => {
  try {
    if (req.body.email && req.body.phone && req.body.organisation && req.body.name) {
      if ((validator.isNull(req.body.email) || validator.isNull(req.body.name) ||
        validator.isNull(req.body.organisation) || validator.isNull(req.body.phone))
        || !(validator.isEmail(req.body.email)) || (!validator.isAlpha(req.body.name)
        && !validator.isAlpha(req.body.organisation))) {
        res.status(400).send('Bad Request: Invalid input for the register fields');
        console.warn('Register fields are invalid');
        return {};
      }
    } else {
      res.status(400).send('Bad Request: Invalid input for the register fields');
      console.warn('Register fields are invalid');
      return {};
    }

    const pwd = generatePassword(12, false);
    console.warn('Generated the password : ', pwd);

    const email = req.body.email;
    const user = new User({
      email: email.toLowerCase(),
      name: req.body.name,
      password: pwd,
      organisation: req.body.organisation,
      phone: req.body.phone,
    });

    user.save((err) => {
      if (!err) {
        return res.json({
          status: 'OK',
          userid: user.id,
        });
      }
      console.warn('Error received : ', err);
      res.status(500).send('Something went wrong, try again later');
      return {};
    });
  } catch (err) {
    console.warn('Error received : ', err);
    next(err);
    return {};
  }
});

router.post('/forgotpassword', async (req, res, next) => {
  try {
    if (req.body.email) {
      if (validator.isNull(req.body.email) || !validator.isEmail(req.body.email)) {
        res.status(400).send('Bad Request: Invalid input for the register fields');
        console.warn('Register fields are invalid');
        return {};
      }
    } else {
      res.status(400).send('Bad Request: Invalid input for the register fields');
      console.warn('Register fields are invalid');
      return {};
    }

    const email = req.body.email.toLowerCase();

    User.findOne({ email }, 'id name password', (err, user) => {
      if (!err) {
        const util = new Util();
        const message = `<html><body><p>For email ${email} password is :
         (${user.password})</p></body></html>`;
        const frommail = 'support@onedigitalad.com';
        util.sendMailUtil(frommail, email, message, 'Password !');
        return res.json({
          status: 'OK',
          userid: user.id,
        });
      }
      console.warn('Error received : ', err);
      res.status(500).send('Something went wrong, try again later');
      return {};
    });
  } catch (err) {
    console.warn('Error received : ', err);
    next(err);
    return {};
  }
});
export default router;
