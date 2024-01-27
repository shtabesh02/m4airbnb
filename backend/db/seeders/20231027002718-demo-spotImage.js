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
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1705772111/samples/landscapes/architecture-signs.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1705772111/samples/landscapes/architecture-signs.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://res.cloudinary.com/dqvwvomz1/image/upload/v1705772111/samples/landscapes/architecture-signs.jpg',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 6,
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
