
import 'bootstrap/dist/css/bootstrap.css';
import 'react-phone-number-input/style.css'
import './overrides.css'
import './sidebar.css'
import './floating-label.css'

import React from 'react';
import { ThemeProvider } from 'styled-components'
import {buildClient} from '../api/build-client';
import Header from './_header';

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

class AppComponent extends React.Component<any, any> {

  static async getInitialProps(appContext) {
    const client = buildClient(appContext.ctx);

    const { data: currentUser } = await client.get('/api/users/currentuser');
    const { data: cart } = await client.get('/api/cart');


    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component
        .getInitialProps(appContext.ctx, client, currentUser, cart)
    }

    return {
      pageProps,
      ...currentUser
    };
  }

  render() {
    const { Component, pageProps, currentUser } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Header currentUser={currentUser} {...pageProps}/>
        <Component currentUser={currentUser} {...pageProps} />
      </ThemeProvider>
    )
  }
}

export default AppComponent;