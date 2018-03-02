const request = require('supertest');
const should = require('chai').should();

const app = require('../../');
const Pickme = require('../../models').Pickme;
const pickmeTestData = require('./pickme.json');

describe('GET /pickmes는', () => {
  before(() => Pickme.destroy({ where: {}, truncate: true }));
  before(() => Pickme.bulkCreate(pickmeTestData));

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
    it('Pickme 객체를 담은 배열을 응답한다', done => {
      request(app)
        .get('/pickmes')
        .set('Authorization', token)
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });

    it('최대 limit 갯수 만큼 응답한다', done => {
      request(app)
        .get('/pickmes?limit=2')
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
      .get('/pickmes?limit=two')
      .set('Authorization', token)
      .expect(400)
      .end(done);
    });

    it('limit이 100보다 클 경우 400을 응답한다', done => {
      request(app)
      .get('/pickmes?limit=999')
      .set('Authorization', token)
      .expect(400)
      .end(done);
    });
  });
});

describe('GET /pickmes/:id는', () => {
  before(() => Pickme.destroy({ where: {}, truncate: true }));
  before(() => Pickme.bulkCreate(pickmeTestData));

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
    it('id가 1인 Pickme 객체를 반환한다', done => {
      request(app)
        .get('/pickmes/1')
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
        .get('/pickmes/abc')
        .set('Authorization', token)
        .expect(400)
        .end(done);
    });

    it('id로 Pickme를 찾을 수 없는 경우 404를 응답한다', done => {
      request(app)
        .get('/pickmes/999')
        .set('Authorization', token)
        .expect(404)
        .end(done);
    });
  });
});

describe('DELETE /pickmes/:id는', () => {
  before(() => Pickme.destroy({ where: {}, truncate: true }));
  before(() => Pickme.bulkCreate(pickmeTestData));

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
        .delete('/pickmes/1')
        .set('Authorization', token)
        .expect(204)
        .end(done);
    });
  });

  describe('실패 시', () => {
    it('id가 숫자가 아닐경우 400으로 응답한다', done => {
      request(app)
        .delete('/pickmes/abc')
        .set('Authorization', token)
        .expect(400)
        .end(done);
    });
  });
});

describe('POST /pickmes는', () => {
  before(() => Pickme.destroy({ where: {}, truncate: true }));
  before(() => Pickme.bulkCreate(pickmeTestData));

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

  const NAME = '홍길동';
  const DESCRIPTION = '천하무적';
  const IMAGE = '/images/ryan.png';
  const CATEGORY_ID = 1;

  describe('성공 시', () => {
    let body;
    before(done => {
      request(app)
        .post('/pickmes')
        .set('Authorization', token)
        .send({
          name: NAME,
          description: DESCRIPTION,
          image: IMAGE,
          category_id: CATEGORY_ID
        })
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('생성된 Pickme 객체를 반환한다', () => {
      body.should.have.property('id');
    });

    it('입력한 name 반환한다', () => {
      body.should.have.property('name', NAME);
    });
  });

  describe('실패 시', () => {
    it('name 파라미터 누락 시 400을 반환한다', done => {
      request(app)
        .post('/pickmes')
        .set('Authorization', token)
        .send({})
        .expect(400)
        .end(done);
    });
  });
});

describe('PUT /pickmes/:id는', () => {
  before(() => Pickme.destroy({ where: {}, truncate: true }));
  before(() => Pickme.bulkCreate(pickmeTestData));

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

  const NAME = '갓세정';
  const DESCRIPTION = '갓세정, 퀸세정, 아재세정, 원더세정(edit)';
  const IMAGE = '/images/ryan.png';
  const CATEGORY_ID = 1;

  describe('성공 시', () => {
    it('변경 된 name을 응답한다', done => {
      request(app)
        .put('/pickmes/3')
        .set('Authorization', token)
        .send({
          name: NAME,
          description: DESCRIPTION,
          image: IMAGE,
          category_id: CATEGORY_ID
        })
        .end((err, res) => {
          res.body.should.have.property('name', NAME);
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('정수가 아닌 id일 경우 400을 응답한다', done => {
      request(app)
        .put('/pickmes/abc')
        .set('Authorization', token)
        .expect(400)
        .end(done);
    });

    it('name이 없을 경우 400 응답한다', done => {
      request(app)
        .put('/pickmes/3')
        .set('Authorization', token)
        .send({})
        .expect(400)
        .end(done);
    });

    it('없는 Pickme일 경우 404를 응답한다', done => {
      request(app)
        .put('/pickmes/999')
        .set('Authorization', token)
        .send({
          name: NAME,
          description: DESCRIPTION,
          image: IMAGE,
          category_id: CATEGORY_ID
        })
        .expect(404)
        .end(done);
    });
  });
});