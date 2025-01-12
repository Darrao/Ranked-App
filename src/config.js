const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://ranled-app-937f5a579c31.herokuapp.com'
    : 'http://localhost:3000';

export default API_URL;