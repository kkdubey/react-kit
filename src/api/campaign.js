/* eslint-disable */
import { Router } from 'express';
const router = new Router();
import UserCampaign from '../core/models/UserCampaignModel';
import mongoose from 'mongoose';
import { apiMode } from '../config';
import Util from './util';

import CampaignDAO from '../core/dao/campaign/CampaignDAO';

router.get('/get/:campaignId', async(req, res, next) => {
  try {
    const campaignId = new mongoose.Types.ObjectId(req.params.campaignId);
    console.warn('Campaign Id : ', campaignId);
    UserCampaign.findOne({ _id: campaignId })
      .populate('creatives')
      .exec((err, userCampaign) => {
        if (err) {
          return res.send(500, `Error while the retrieving campaign : ${req.params.campaignId}`);
        }

        if (userCampaign) {
          return res.json({
            status: 'OK',
            result: userCampaign,
          });
        } else {
          return res.status(404).send(`Cant find the campaign with id : ${req.params.campaignId}`);
        }
      });
  } catch (err) {
    next(err);
    return false;
  }
});

router.get('/list', async(req, res, next) => {
  try {
    console.log('Sending campaign list: ', req.query.userid);
    const uId = new mongoose.Types.ObjectId(req.query.userid);

    UserCampaign.find({ created_userid: uId })
      .populate({
        path:'creatives',
        select: 'cdnUrl imageHeight imageWidth _id ',
      })
      .exec((err, docs) => {
        if (!err) {
          const campaignDAO = new CampaignDAO();
          let advertiserName = '';
          if (docs.length > 0) {
            advertiserName = docs[0].advertiser;
          }

          if (apiMode === 'dummy') {
            return res.json({
              status: 'OK',
              campaigns: docs,
            });
          } else {
            campaignDAO.getCampaignPerformance(advertiserName, (dErr, results) => {
              if (!dErr) {
                for (let i = 0; i <= docs.length - 1; i++) {
                  const campaignName = docs[i].campaign_name;
                  const campaignObject = results[campaignName];
                  if (campaignObject) {
                    docs[i].performance = campaignObject;
                  }
                }

                return res.json({
                  status: 'OK',
                  campaigns: docs,
                });
              } else {
                console.warn('Error received : ', err);
                res.status(404).send('Not Able to fetch the campaigns');
                return false;
              }

            });
          }
        } else {
          console.warn('Error received : ', err);
          res.status(404).send('Not Able to fetch the campaigns');
          return false;
        }
      });
  } catch (err) {
    next(err);
    return false;
  }
});

router.get('/archive', async(req, res, next) => {
  try {
    console.log('archive campaign: ', req.query.userid);
    const uId = new mongoose.Types.ObjectId(req.query.userid);
    UserCampaign.find({ created_userid: uId, campaign_running_status: 'Archive' })
      .populate('creatives')
      .exec((err, docs) => {
        if (!err) {
          return res.json({
            status: 'OK',
            campaigns: docs,
          });
        }
        console.warn('Error received : ', err);
        res.status(404).send('Not Able to fetch the campaigns');
        return false;
      });
  } catch (err) {
    next(err);
    return false;
  }
});

router.post('/status', async(req, res, next) => {
  try {
    const post = JSON.parse(JSON.stringify(req.body));
    const campaignId = new mongoose.Types.ObjectId(post.campaignid);

    UserCampaign.findOne({ _id: campaignId }, (err, campaign) => {
      if (err) return res.send(500, { error: err });

      if (campaign) {
        console.warn(campaign);
        const currentStatus = campaign.campaign_running_status;
        const newStatus = post.status;
        console.warn('new status', newStatus);
        console.warn('current status', currentStatus);
        let error = false;
        console.log(currentStatus, newStatus);

        if (currentStatus === 'Approved') {
          if (newStatus !== 'Started') {
            error = true;
          }
        } else if (currentStatus === 'Started') {
          if (newStatus !== 'Stopped') {
            error = true;
          }
        } else if (currentStatus === 'Stopped') {
          if (newStatus !== 'Started') {
            error = true;
          }
        } else if (currentStatus === 'Pending') {
          if (newStatus !== 'Approved') {
            error = true;
          }
        }

        if (error) {
          return res.status(400).send(
            `Campaign status: ${newStatus} cannot be changed from : ${currentStatus}`);
        }

        UserCampaign.update({ _id: campaignId }, { $set: { campaign_running_status: newStatus } },
          { multi: false }, (updateErr) => {
            if (updateErr) return res.send(500, { error: updateErr });
            const message = `<html><body><p>For Campaign: ${campaignId}
              status changed to ${newStatus}</p></body></html>`;
            const frommail = 'support@onedigitalad.com';
            const subject = `Campaign ${campaignId} status change !`;
            const util = new Util();
            util.sendMailUtil(frommail, 'operations@onedigitalad.com', message, subject);
            return res.json({
              status: 'OK',
              message: 'Campaign status saved successfully.',
            });
          });
      } else {
        return res.status(500).send({ message: 'Not able to find the campaign' });
      }
    });
  } catch (err) {
    next(err);
    return false;
  }
});

router.delete('/:campaignId', async(req, res, next) => {
  try {
    const campaignId = new mongoose.Types.ObjectId(req.params.campaignId);
    console.warn('Campaign Id : ', campaignId);
    UserCampaign.findOne({ _id: campaignId }, (err, userCampaign) => {
      if (err) {
        return res.status(500).send('Error while the deleting campaign ');
      }

      if (userCampaign) {
        if (userCampaign.campaign_running_status === 'Archive') {
          UserCampaign.findOneAndRemove({ _id: campaignId }, (delErr) => {
            if (delErr) return res.status(500).send('Error while deleting the campaign.');
            return res.json({
              status: 'OK',
              message: 'Campaign deleted successfully.',
            });
          });
        } else {
          return res.status(400).send('Cannot delete the campaign which is not Archive');
        }
      } else {
        return res.status(404).send('Cant find the campaign for deleting.');
      }
    });
  } catch (err) {
    next(err);
    return false;
  }
});

router.post('/', async(req, res, next) => {
  try {
    const post = JSON.parse(JSON.stringify(req.body));
    console.warn(post);
    const setObject = {};
    for (const key in post.key) {
      if (post.key.hasOwnProperty(key)) {
        if (key === 'created_userid') {
          setObject[key] = new mongoose.Types.ObjectId(post.key[key]);
        } else {
          setObject[key] = post.key[key];
        }
      }
    }

    UserCampaign.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(post.campaignid) },
      { $set: setObject }, { multi: false, upsert: true, new: true }, (err, campaign) => {
        if (err) return res.status(500).send({ error: err });
        return res.json({
          status: 'OK',
          message: 'Campaign saved successfully.',
          id: campaign._id,
        });
      });
  } catch (err) {
    next(err);
    return false;
  }
});

export default router;
