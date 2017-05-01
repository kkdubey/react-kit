import React from 'react';
import NewCampaign from './NewCampaign';

export default {

  path: '/NewCampaign',
  action() {
    const retval = (
      <NewCampaign />
    );
    return retval;
  },
};
