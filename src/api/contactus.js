/* eslint-disable consistent-return */
import { Router } from 'express';
import ContactUsForDemo from '../core/models/ContactUsForDemo';
import validator from 'validator';
import Util from './util';
const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    res.status(400).send({ msg: 'No support for Get on / ' });
    return {};
  } catch (err) {
    next(err);
  }
});

router.post('/contactusfordemo', async (req, res, next) => {
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

    const email = req.body.email;
    const contactUsForDemo = new ContactUsForDemo({
      email: email.toLowerCase(),
      name: req.body.name,
      organisation: req.body.organisation,
      phone: req.body.phone,
    });

    const message = `<html><body><p>'${req.body.name} (${email}) want demo</p></body></html>`;
    const frommail = 'support@onedigitalad.com';
    const util = new Util();
    util.sendMailUtil(frommail, 'operations@onedigitalad.com', message, 'Need Demo !');

    contactUsForDemo.save((err) => {
      console.warn('Error received : ', err);
      if (!err) {
        return res.json({
          status: 'OK',
          contactUsForDemoid: contactUsForDemo.id,
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

router.post('/sendmail', async (req, res, next) => {
  try {
    const message = `<html><body><p>Testing SparkPost -
      the world\'s most awesomest email service!</p></body></html>`;
    const util = new Util();
    util.sendMailUtil('testing@sparkpostbox.com', 'kkdubey12@gmail.com', message, 'Need Demo');
  } catch (err) {
    console.warn('Error received : ', err);
    next(err);
    return {};
  }
});

export default router;
