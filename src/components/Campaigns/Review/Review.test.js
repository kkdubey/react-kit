import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Review } from './Review';

describe('Review', () => {
  describe(' When userid 1 is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };
    describe('Review will return div', () => {
      const wrapper = shallow(
        <Review
          budget={{
            currency: '',
            total: '',
            cpm: '',
            campaign_budget_upload: '',
          }}
          schedule={{
            startdate: '',
            enddate: '',
            starttime: '',
            endtime: '',
            campaign_schedule_upload: '',
          }}
          fequencyCapUser={{
            total_views: '',
            daily_views: '',
          }}
          location={{
            cities: [],
            locationInclude: true,
          }}
          objective={{
            campaign_name: '',
            campaign_brand_category: '',
            campaign_objective: '',
            campaign_type: '',
          }}
          target={{
            gender: '',
            income_group: [],
            tags: [],
            agegroup: [],
            interests: [],
            websites: [],
            tagsInclude: true,
            interestsInclude: true,
            webSitesInclude: true,
          }}
          creatives={[{
            creativeId: '',
            cdnUrl: '',
            imageHeight: '',
            imageWidth: '',
          }]}
        />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
    });
  });
});
