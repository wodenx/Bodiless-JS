import axios from 'axios';
import { withMenuOptions } from '@bodiless/core';

const GATSBY_REFRESH_ENDPOINT = '/__refresh';

const useMenuOptions = () => [{
  name: 'gatsby-refresh-data',
  icon: 'refresh',
  label: 'Data',
  handler: () => {
    try {
      axios.post(new URL(GATSBY_REFRESH_ENDPOINT, window.location.origin).href);
    } catch (e) {
      alert(e);
    }
  },
}];

const withRefreshButton = withMenuOptions({ useMenuOptions, name: 'Gatsby Refresh', peer: true });

export default withRefreshButton;
