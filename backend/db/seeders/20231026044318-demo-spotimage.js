'use strict';

const {SpotImage} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SpotImage', null, {});
  }
};
