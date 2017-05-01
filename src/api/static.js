/* eslint-disable*/
import { Router } from 'express';
import StaticData from '../core/models/StaticDataModel';
import Location from '../core/models/LocationModel';
import Tag from '../core/models/TagModel';

import { limitResultsConfig } from '../config';

const router = new Router();

router.get('/', async(req, res, next) => {
  try {
    console.log('Sending data for key : ', req.query.key);
    StaticData.findOne({ key: req.query.key }, (err, statics) => {
      if (err) return res.status(500).send(`Error while fetching data for : ${req.query.key}`);
      if (!statics) return res.status(404).send(`No data found for key : ${req.query.key}`);
      return res.json({
        status: 'OK',
        data: { key: statics.key, values: statics.data },
      });
    });
  } catch (err) {
    next(err);
    return false;
  }
});
router.put('/', async(req, res, next) => {
  try {
    const post = JSON.parse(JSON.stringify(req.body));
    console.log('Putting the static data for the key', post.key);
    const staticData = { key: post.key, data: post.data, description: post.description };
    StaticData.create(staticData, (err) => {
      console.warn(err);
      if (err) return res.status(500).send(`Error while creating the data for ${post.key}`);
      return res.json({
        status: 'OK',
        message: `Created the data for key ${post.key}`,
      });
    });
  } catch (err) {
    next(err);
    return false;
  }
});

router.get('/location/search', async(req, res, next) => {
  try {
    const keyword = req.query.kword;
    console.warn(`Received keyword ${keyword}`);
    let limitResults = parseInt(req.query.limitResults, 10);
    if (!limitResults) {
      limitResults = limitResultsConfig;
    }

    Location.find({ name: { $regex: keyword, $options: 'i' } }, 'name canonical_name country_code location_type -_id', (err, locations) => {
      if (err) {
        console.warn(err);
        res.status(500).send(`Error occured while retrieving for ${keyword}`);
      } else {
        if (!locations.length) {
          res.status(404).send(`Not able to get keywords for ${keyword}`);
        } else {
          res.json({
            status: 'OK',
            results: locations,
          });
        }
      }

      return true;
    }).limit(limitResults).sort({ name: 1 });
  } catch (err) {
    next(err);
    return false;
  }
});

router.get('/tags/search', async(req, res, next) => {
  try {
    const keyword = req.query.kword;
    console.warn(`Received keyword for tags ${keyword}`);
    let limitResults = parseInt(req.query.limitResults, 10);
    if (!limitResults) {
      limitResults = limitResultsConfig;
    }

    Tag.find({ name: { $regex: keyword, $options: 'i' } }, 'name description data -_id', (err, tags) => {
      if (err) {
        console.warn(err);
        res.status(500).send(`Error occured while retrieving for ${keyword}`);
      } else {
        if (!tags.length) {
          res.status(404).send(`Not able to get keywords for ${keyword}`);
        } else {
          res.json({
            status: 'OK',
            results: tags,
          });
        }
      }

      return true;
    }).limit(limitResults).sort({ name: 1 });
  } catch (err) {
    next(err);
    return false;
  }
});

export default router;
