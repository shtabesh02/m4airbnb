'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User,
        //  {as: 'Owner'}, 
         {
        foreignKey: 'ownerId',
        // onDelete: 'cascade'
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'cascade'
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'cascade'
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'cascade'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Street address is required'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: ' City is required'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'State is required'
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Country is required'
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        notEmpty: {
          msg: 'Latitude is not valid'
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        notEmpty: {
          msg: 'Longitude is not valid'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          max: 50,
          msg: 'Name must be less than 50 characters'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        notEmpty: {
          msg: 'Price per day is required.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};