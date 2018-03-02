require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
  }
);

/**
 * User 모델
 */
const User = sequelize.define('User', {
  // 사용자 이름
  username: {
    type: Sequelize.STRING,
    unique: true, // 고유하다
    validate: {
      isAlphanumeric: true // 알파벳과 숫자만 가능
    }
  },
  // 이메일
  email: {
    type: Sequelize.STRING,
    unique: true, // 고유하다
    validate: {
      isEmail: true // 이메일 포맷만 가능
    }
  },
  password: Sequelize.STRING,
  // 회원가입 이후 이메일 검증용으로 사용
  confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  // 페이스북 로그인 확인
  facebook: Sequelize.STRING
});

/**
 * Category 모델
 */
const Category = sequelize.define('Category', {
  // 제목
  title: {
    type: Sequelize.STRING
  },
  // 설명
  description: Sequelize.TEXT,
  // 이미지
  image: Sequelize.STRING
});

/**
 * Pickme 모델
 */
const Pickme = sequelize.define('Pickme', {
  // 이름
  name: Sequelize.STRING,
  // 설명
  description: Sequelize.STRING,
  // 이미지
  image: Sequelize.STRING,
  // 카테고리 아이디
  category_id: Sequelize.INTEGER
})

module.exports = {
  Sequelize,
  sequelize,
  User,
  Category,
  Pickme
};