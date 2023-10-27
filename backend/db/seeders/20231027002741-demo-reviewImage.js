'use strict';

const {ReviewImage} = require('../models');

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://unsplash.com/photos/white-flowers-with-green-leaves-F8OQu0IEXKU'
      },
      {
        reviewId: 2,
        url: 'https://unsplash.com/photos/white-flowers-on-brown-tree-branch-GZKBMRhItM8'
      },
      {
        reviewId: 2,
        url: 'https://unsplash.com/photos/purple-flowers-in-tilt-shift-lens-cTxmWeBfOvk'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImage';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: {[Op.in]: [1,2]}
    }, {});
  }
};
