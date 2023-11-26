'use strict';
const { request } = require('express');
const { Model, Op, Sequelize } = require('sequelize');


// const {Sequelize} = require('../../db/models');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        // onDelete: 'cascade'
      });

      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        // onDelete: 'cascade'
      })
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
