module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    db: 'mongodb://localhost/SredDev',
    app: {
      name: 'Sred'
    },
  },
  test: {

  },
  production: {

  }
}