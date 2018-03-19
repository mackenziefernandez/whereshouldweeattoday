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
      apiKey: 'AIzaSyDiTRYRMAPIG5udTp1S61e4oW6Bh1oAssE',
      authDomain: 'what-should-we-eat.firebaseapp.com',
      databaseURL: 'https://what-should-we-eat.firebaseio.com/'
    }
  }
};

export default env.production; // env[process.env.NODE_ENV] || env.test;
