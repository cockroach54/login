/**
 *   host: "testdb.crpltbxuj6nb.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "checker2018",
  database: "test"
 */
// mysql2 설치 필요
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'root', 'checker2018', {
  host: 'testdb.crpltbxuj6nb.ap-northeast-2.rds.amazonaws.com',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

const User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync()
  .then(() => User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  }))
  .then(jane => {
    console.log(jane.toJSON());
  });