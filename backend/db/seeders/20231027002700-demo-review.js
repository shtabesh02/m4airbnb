'use strict';

const {Review} = require('../models');

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'Awesome',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Gorgeous',
        stars: 5
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Amazing',
        stars: 5
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: {[Op.in]: [1,2,3]}
    }, {});
  }
};
