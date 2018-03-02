const index = require('./');
const auth = require('./auth');
const user = require('./user');
const category = require('./category');
const pickme = require('./pickme');

module.exports = (app) => {

  // 인덱스
  app.use('/', index);

  // 권한 관리
  app.use('/auth', auth);

  // 사용자 관리
  app.use('/users', user);

  // 카테고리 관리
  app.use('/categories', category);

  // PICKME 관리
  app.use('/pickmes', pickme);

};