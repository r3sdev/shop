import {useRouter} from 'next/router';

import buildClient from '../api/build-client';
import Header from '../components/header';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-phone-number-input/style.css'
import './overrides.css'
import './sidebar.css'

const AppComponent = ({ Component, pageProps, currentUser }) => {

  const router = useRouter();

  const pathname = router.pathname;
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className={isAdminRoute ? "" : "container-fluid mt-3"}>
        <Component currentUser={currentUser} {...pageProps}/>
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
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
};

export default AppComponent;