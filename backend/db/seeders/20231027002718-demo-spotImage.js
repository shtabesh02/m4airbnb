'use strict';

const {SpotImage} = require('../models');

// /** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400585/todd-kent-178j8tJrNlc-unsplash_epodhv.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400583/scott-webb-1ddol8rgUH8-unsplash_1_gxuifg.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400583/rowan-heuvel-bjej8BY1JYQ-unsplash_1_npjupt.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400583/spacejoy-YI2YkyaREHk-unsplash_bi3tkm.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400583/stephan-bechert-yFV39g6AZ5o-unsplash_hsjqew.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400579/frames-for-your-heart-2d4lAQAlbDA-unsplash_x8g2aj.jpg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400578/douglas-sheppard-9rYfG8sWRVo-unsplash_qeua8c.jpg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400578/brian-babb-XbwHrt87mQ0-unsplash_uux0yu.jpg',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400577/alexandra-gorn-JIUjvqe2ZHg-unsplash_vkqwst.jpg',
      preview: true
    },
    {
      spotId: 6,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1706400576/alberto-castillo-q-mx4mSkK9zeo-unsplash_flcrgd.jpg',
      preview: true
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
