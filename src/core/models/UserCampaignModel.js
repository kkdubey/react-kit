const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCampaign = new Schema({
  campaign_name: {
    type: String,
    required: true,
  },
  campaign_objective: {
    type: String,
    required: true,
  },
  campaign_type: {
    type: String,
    required: true,
  },
  campaign_brand_category: {
    type: String,
    required: true,
  },
  agegroups: {
    type: [String],
  },
  incomegroups: {
    type: [String],
  },
  max_total_views_per_visitor: {
    type: String,
  },
  max_daily_views_per_visitor: {
    type: String,
  },
  creatives: [
    { type: Schema.Types.ObjectId, ref: 'Creative' },
  ],
  created_userid: Schema.Types.ObjectId,
  performance: {
    type: Schema.Types.Mixed,
  },
  frequency_cap: {
    type: Schema.Types.Mixed,
  },
  campaign_running_status: {
    type: String,
    required: true,
  },
  campaign_budget: {
    type: Schema.Types.Mixed,
    required: true,
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
  },
  starttime: {
    type: Date,
  },
  endtime: {
    type: Date,
  },
  target: {
    type: {
      include: Schema.Types.Mixed,
      exclude: Schema.Types.Mixed,
    },
  },
  location: {
    type: {
      include: Schema.Types.Mixed,
      exclude: Schema.Types.Mixed,
      markers: [Schema.Types.Mixed],
    },
  },
  campaign_budget_upload: {
    type: String,
  },
  campaign_schedule_upload: {
    type: String,
  },
  advertiser: {
    type: String,
  },
  campaign_identifier: {
    type: String,
  },

},
  { timestamps: true });
module.exports = mongoose.model('UserCampaign', UserCampaign);
