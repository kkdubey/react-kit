import os from 'os';

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

export const mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/one';

export const analyticsDBUrl = process.env.ANALYTICS_DB_URI || 'postgres://postgres:sunil@localhost/rtb';

export const realtimeDBUrl = process.env.REALTIME_DB || ['localhost'];

export const realtimeDBKeySpace = process.env.REALTIME_DB_KEY_SPACE || 'rtb';

export const apiMode = process.env.API_MODE || 'dummy';

export const onemediaTimeZone = 'Asia/Kolkata';

export const previewUrl = process.env.PREVIEW_URL || 'http://cdn.onedigitalad.com/onemedia/preview/index.html';

export const defaultLocation = { lat: 12.9716, lng: 77.5946 };

export const campaignStatsQuery = 'SELECT SUM(spend) as spend, SUM(impression) as impressions, ' +
  ' SUM(click) as clicks, campaign_name FROM campaign_performance WHERE time_sql_date BETWEEN ' +
  ' $1 AND $2 AND campaign_name=$3 AND advertiser=$4 GROUP BY campaign_name';

export const campaignCVTTQuery = 'SELECT SUM(view_attribution_count) as vtt, ' +
  ' SUM(click_attribution_count) as ctt ' +
  ' FROM site_performance WHERE time_sql_date BETWEEN ' +
  ' $1 AND $2 AND customer_id=$3';

export const campaignDataQuery = 'SELECT time_sql_date, impression as impressions, ' +
  'click as clicks, spend as spend from campaign_performance where ' +
  ' time_sql_date BETWEEN $1 AND $2 AND campaign_name=$3 AND advertiser=$4 ORDER BY ' +
  ' time_sql_date ASC';

export const siteAnalyticsGraphQuery = 'SELECT visitor_count as visitors,' +
  ' pv as pvs, time_sql_date' +
  ' FROM site_performance where time_sql_date BETWEEN $1 AND $2 AND customer_id = $3' +
  ' ORDER BY time_sql_date ASC';

export const siteAnalyticsCityWiseQuery = 'SELECT visitor_count as visitorbycity,' +
  ' city_category as citytype, time_sql_date' +
  ' FROM site_performance_city_category where' +
  ' time_sql_date BETWEEN $1 AND $2 AND customer_id = $3' +
  ' ORDER BY time_sql_date ASC';

export const campaignRealTimeDBQuery = 'select SUM(click) as click, ' +
  ' SUM(impression) as impression, SUM(spend) as spend from log_counter_date_time' +
  ' where log_date = ? and time_hour<=?' +
  ' and campaign_name = ? and advertiser = ?';

export const campaignAppTransactionDBQuery = 'select SUM(ctxn) as ctxn, SUM(vtxn) as vtxn ' +
  ' from app_txn_counter_date_time' +
  ' where log_date = ? and time_hour<=?' +
  ' and advertiser = ?';

export const campaignAppTransactionTotalDBQuery = 'select ctxn, vtxn from app_txn_counter_date ' +
  'where log_date = ? and advertiser = ?';

export const campaignSiteTransactionDBQuery = 'select SUM(ctxn) as ctxn, SUM(vtxn) as vtxn ' +
  'from site_txn_counter_date_time ' +
  'where log_date = ? and time_hour<=? ' +
  'and advertiser = ?';

export const campaignSiteTransactionTotalDBQuery = 'select ctxn, vtxn from site_txn_counter_date ' +
  'where log_date = ? and advertiser = ?';

export const siteRealTimeDBQuery = 'select SUM(pv) as pv from site_counter_date_time' +
  ' where log_date = ? and time_hour <= ?' +
  ' and advertiser = ? and visitor_tag = ?';

export const siteRealTimeDBTotalQuery = 'select pv from site_counter_date where log_date = ? ' +
  'and advertiser = ? and visitor_tag = ? ';
export const campaignPerformanceQuery = 'SELECT campaign_name, SUM(spend) as spend, ' +
  ' SUM(impression) as impressions, ' +
  ' SUM(click) as clicks FROM campaign_performance WHERE' +
  ' advertiser=$1 GROUP BY campaign_name';

export const campaignRealTimeDBTotalQuery = 'select * from log_counter_date' +
  ' where log_date = ? and campaign_name = ? and advertiser = ?';
export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

};

export const googleMapsKey = 'AIzaSyBLcJcl_K2-XmoXTNO-vV44hnnTHgHLqCk';

export const onemediaDateFormat = 'DD/MM/YYYY'; // moment js format

export const defaultCurrency = 'INR';

export const AWSConfig = {
  cdnUrl: process.env.CDN_URL || 'http://oda-1media.s3.amazonaws.com',
  campaign_dir: os.tmpDir(),
  region: process.env.AWS_S3_BUCKET_REGION || 'ap-southeast-1',
  campaign_bucket: process.env.AWS_S3_BUCKET || 'oda-1media',
  credentials: {
    accessKey: process.env.AWS_S3_KEY || 'AKIAJ4XM6GMNFCCKHDNA',
    secretKey: process.env.AWS_S3_SECRET || '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',
  },
};

export const limitResultsConfig = 5;

export const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const sparkPostapiKey = process.env.SPARKPOST_API_KEY
  || 'b14194695e23632b52f15de57ca7914c34d78579';

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '186244551745631',
    secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID
      || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret: process.env.TWITTER_CONSUMER_SECRET ||
      'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
  },

};
