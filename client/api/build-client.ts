import axios from 'axios';

export const buildClient = ({ req }) => {

  if (typeof window === 'undefined') {
    /**
     * We are on the server
     *
     * Requests should be made with a baseUrl of 'http://SERVICE_NAME.NAMESPACE.svc.cluster.local'
     */

    const client = axios.create({
      baseURL: process.env.BASE_URL,
      headers: req.headers,
    });


    // Limit logging
    client.interceptors.response.use(
      res => res,
      error => {
        if (error.response.status === 404) {
          throw new Error(`404: ${error.config.url} not found`);
        }
        if (error.response.status === 502) {
          throw new Error(`502: ${error.config.url} not ready`);
        }
        if (error.response.status === 503) {
          throw new Error(`503: ${error.config.url} not ready`);
        }
        // // Error 😨
        // if (error.response) {
        //   /*
        //    * The request was made and the server responded with a
        //    * status code that falls out of the range of 2xx
        //    */
        //   console.log(error.response.data);
        //   console.log(error.response.status);
        //   console.log(error.response.headers);
        // } else if (error.request) {
        //   /*
        //    * The request was made but no response was received, `error.request`
        //    * is an instance of XMLHttpRequest in the browser and an instance
        //    * of http.ClientRequest in Node.js
        //    */
        //   console.log(error.request);
        // } else {
        //   // Something happened in setting up the request and triggered an Error
        //   console.log('Error', error.message);
        // }
        // console.log(error);
  
        throw error;
      }
    );

    return client

  } else {
    /**
     * We must be on the browser
     *
     * Requests should be made with a baseUrl of ''
     */

    const client = axios.create();




    return client;
  }
}