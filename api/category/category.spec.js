const request = require('supertest');
const should = require('chai').should();

const app = require('../../');
const Category = require('../../models').Category;
const categoryTestData = require('./category.json');

describe('GET /categories는', () => {
  before(() => Category.destroy({ where: {}, truncate: true }));
  before(() => Category.bulkCreate(categoryTestData));

  let token;
  before(done => {
    request(app)
      .post('/auth/login')
      .send({
        loginfield: 'jakejoo',
        password: 'qwer1234'
      })
      .end((err, res) => {
        token = `bearer ${res.body.access_token}`;
        done();
      });
  });

  describe('성공 시', () => {
    it('카테고리 객체를 담은 배열을 응답한다', done => {
      request(app)
        .get('/categories')
        .set('Authorization', token)
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });

    it('최대 limit 갯수 만큼 응답한다', done => {
      request(app)
        .get('/categories?limit=2')
        .set('Authorization', token)
        .end((err, res) => {
          res.body.should.have.lengthOf(2);
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('limit이 숫자형이 아니면 400을 응답한다', done => {
      request(app)
      .get('/categories?limit=two')
      .set('Authorization', token)
      .expect(400)
      .end(done);
    });

    it('limit이 100보다 클 경우 400을 응답한다', done => {
      request(app)
      .get('/categories?limit=999')
      .set('Authorization', token)
      .expect(400)
      .end(done);
    });
  });
});

describe('GET /categories/:id는', () => {
  before(() => Category.destroy({ where: {}, truncate: true }));
  before(() => Category.bulkCreate(categoryTestData));

  let token;
  before(done => {
    request(app)
      .post('/auth/login')
      .send({
        loginfield: 'jakejoo',
        password: 'qwer1234'
      })
      .end((err, res) => {
        token = `bearer ${res.body.access_token}`;
        done();
      });
  });

  describe('성공 시', () => {
    it('id가 1인 카테고리 객체를 반환한다', done => {
      request(app)
        .get('/categories/1')
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('id', 1);
          done();
        })
    });
  });

  describe('실패 시', () => {
    it('id가 숫자가 아닐 경우 400을 응답한다', done => {
      request(app)
        .get('/categories/abc')
        .set('Authorization', token)
        .expect(400)
        .end(done);
    });

    it('id로 카테고리를 찾을 수 없는 경우 404를 응답한다', done => {
      request(app)
        .get('/categories/999')
        .set('Authorization', token)
        .expect(404)
        .end(done);
    });
  });
});

describe('DELETE /categories/:id는', () => {
  before(() => Category.destroy({ where: {}, truncate: true }));
  before(() => Category.bulkCreate(categoryTestData));

  let token;
  before(done => {
    request(app)
      .post('/auth/login')
      .send({
        loginfield: 'jakejoo',
        password: 'qwer1234'
      })
      .end((err, res) => {
        token = `bearer ${res.body.access_token}`;
        done();
      });
  });

  describe('성공 시', () => {
    it('204를 응답한다', done => {
      request(app)
        .delete('/categories/1')
        .set('Authorization', token)
        .expect(204)
        .end(done);
    });
  });

  describe('실패 시', () => {
    it('id가 숫자가 아닐경우 400으로 응답한다', done => {
      request(app)
        .delete('/categories/abc')
        .set('Authorization', token)
        .expect(400)
        .end(done);
    });
  });
});

describe('POST /categories는', () => {
  before(() => Category.destroy({ where: {}, truncate: true }));
  before(() => Category.bulkCreate(categoryTestData));

  let token;
  before(done => {
    request(app)
      .post('/auth/login')
      .send({
        loginfield: 'jakejoo',
        password: 'qwer1234'
      })
      .end((err, res) => {
        token = `bearer ${res.body.access_token}`;
        done();
      });
  });

  const TITLE = '테스트용 제목';
  const DESCRIPTION = '테스트용 설명';
  const IMAGE = '/images/produce_101_season2.png';

  describe('성공 시', () => {
    let body;
    before(done => {
      request(app)
        .post('/categories')
        .set('Authorization', token)
        .send({
          title: TITLE,
          description: DESCRIPTION,
          image: IMAGE
        })
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('생성된 카테고리 객체를 반환한다', () => {
      body.should.have.property('id');
    });

    it('입력한 title 반환한다', () => {
      body.should.have.property('title', TITLE);
    });
  });

  describe('실패 시', () => {
    it('title 파라미터 누락 시 400을 반환한다', done => {
      request(app)
        .post('/categories')
        .set('Authorization', token)
        .send({})
        .expect(400)
        .end(done);
    });
  });
});

describe('PUT /categories/:id는', () => {
  before(() => Category.destroy({ where: {}, truncate: true }));
  before(() => Category.bulkCreate(categoryTestData));

  let token;
  before(done => {
    request(app)
      .post('/auth/login')
      .send({
        loginfield: 'jakejoo',
        password: 'qwer1234'
      })
      .end((err, res) => {
        token = `bearer ${res.body.access_token}`;
        done();
      });
  });

  const TITLE = '프로듀스 101 시즌투';
  const DESCRIPTION = '프로듀스 101 시즌투';
  const IMAGE = '/images/produce_101_season2.png';

  describe('성공 시', () => {
    it('변경 된 title을 응답한다', done => {
      request(app)
        .put('/categories/2')
        .set('Authorization', token)
        .send({
          title: TITLE,
          description: DESCRIPTION,
          image: IMAGE
        })
        .end((err, res) => {
          res.body.should.have.property('title', TITLE);
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('정수가 아닌 id일 경우 400을 응답한다', done => {
      request(app)
        .put('/categories/abc')
        .set('Authorization', token)
        .expect(400)
        .end(done);
    });

    it('title이 없을 경우 400 응답한다', done => {
      request(app)
        .put('/categories/3')
        .set('Authorization', token)
        .send({})
        .expect(400)
        .end(done);
    });

    it('없는 카테고리일 경우 404를 응답한다', done => {
      request(app)
        .put('/categories/999')
        .set('Authorization', token)
        .send({
          title: TITLE,
          description: DESCRIPTION,
          image: IMAGE
        })
        .expect(404)
        .end(done);
    });
  });
});