'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Mohammadjan',
        lastName: 'Farasu',
        email: 'user1@user.io',
        username: 'mfarasu',
        hashedPassword: bcrypt.hashSync('password1'),
        firstName: 'Mohammadjan',
        lastName: 'Farasu'
      },
      {
        firstName: 'Alisins',
        lastName: 'Danesh',
        email: 'user2@user.io',
        username: 'adanesh',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Alisina',
        lastName: 'Danesh'
      },
      {
        firstName: 'Sharif',
        lastName: 'Rezaie',
        email: 'user3@user.io',
        username: 'srezaie',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Sharif',
        lastName: 'Rezaie'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['mfarasu', 'adanesh', 'srezaie'] }
    }, {});
  }
};



// Old code

// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };
