'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
     let datas = [];
     for(let i = 0; i < 10; i++){
       let obj = {
         email: "test" + i + "@example.com",
         name: "testUser" + i,
         password: "1234",
        //  createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        //  updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
       }
       datas.push(obj)
     }

     return queryInterface.bulkInsert('users', datas, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('users', {
     email: {[Sequelize.Op.like]: '%test%'}
   }, {});
  }
};
