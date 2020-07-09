import React from 'react';
import { ThemeProvider } from 'styled-components'
import { v4 as uuidv4 } from 'uuid';


import buildClient from '../api/build-client';
import Header from '../components/header';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-phone-number-input/style.css'
import './overrides.css'
import './sidebar.css'

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

class AppComponent extends React.Component<any, any> {

  static async getInitialProps(appContext) {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component
        .getInitialProps(appContext.ctx, client, data.currentUser)
    }

    return {
      pageProps,
      ...data
    };
  }

  componentDidMount() {
    const key = "srdguid"
    const srdguid = localStorage.getItem(key)

    if (!srdguid) {
      console.log('No GUID found ...')
      const guid = uuidv4();
      localStorage.setItem(key, guid)
      console.log('Setting GUID ...', guid)
    }
  }

  render() {
    const { Component, pageProps, currentUser } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Header currentUser={currentUser} />
        <Component currentUser={currentUser} {...pageProps} />
      </ThemeProvider>
    )
  }
}

export default AppComponent;