const env = {
  // test: {
  //   firebaseConfig: {
  //     apiKey: '',
  //     authDomain: '',
  //     databaseURL: ''
  //   }
  // },
  production: {
    firebaseConfig: {
      apiKey: 'AIzaSyBJnp_8Nl75vNIgedUav5EYtjm-4JAOjP0',
      authDomain: 'whereshouldweeattoday.firebaseapp.com',
      databaseURL: 'https://whereshouldweeattoday-18646.firebaseio.com/'
    }
  }
};

export default env.production; // env[process.env.NODE_ENV] || env.test;
