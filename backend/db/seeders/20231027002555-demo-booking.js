'use strict';
const {Booking} = require('../models');

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-10-26'),
        endDate: new Date('2023-10-28')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2023-10-26'),
        endDate: new Date('2023-10-28')
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2023-10-26'),
        endDate: new Date('2023-10-28')
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1,2,3]}
    }, {})
  }
};
