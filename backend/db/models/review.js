'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'cascade'
      });

      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        // onDelete: 'cascade'
      });

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        // onDelete: 'cascade'
      })
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Review text is required"
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Stars must be an integer from 1 to 5"
        },
        max: {
          args: 5,
          msg: "Stars must be an integer from 1 to 5"
        },
        min: {
          args: 1,
          msg: "Stars must be an integer from 1 to 5"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};