'use strict';

const {SpotImage} = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: 'https://unsplash.com/photos/a-winding-road-in-the-middle-of-a-valley-HHBjSjmTDWI',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://unsplash.com/photos/snow-covered-mountain-under-blue-sky-during-daytime-A3fkw12xvpY',
      preview: false
    },
    {
      spotId: 2,
      url: 'https://unsplash.com/photos/green-and-brown-mountains-under-white-clouds-and-blue-sky-during-daytime-f5HXlPaBXsM',
      preview: false
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2] }
    }, {});
  }
};
