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
        if (error.response.status) {
          throw new Error(`${error.response.status}: ${process.env.BASE_URL}${error.config.url} not found`);
        }
  
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

    return axios.create();
  }
}