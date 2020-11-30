export default () => ({
  server: {
    scheme: process.env.SCHEME,
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
  },
  database: {
    uri: process.env.MONGO_URI,
    name: process.env.MONGO_DB_NAME
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION_TIME
  }
})