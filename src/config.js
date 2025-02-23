const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://ranking-app-kodomo-ca4c1991a9c0.herokuapp.com/'
    : 'http://localhost:3000';

export default API_URL;