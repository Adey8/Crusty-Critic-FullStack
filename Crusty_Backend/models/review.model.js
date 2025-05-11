const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Review.belongsTo(models.PizzaPlace, {
        foreignKey: 'pizzeria_name',
        targetKey: 'name',
        as: 'pizzaPlace'
      });
    }
  }

  Review.init({
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    pizzeria_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'pizza_places',
        key: 'name'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_submitted: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    approval_status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true
  });

  return Review;
}; 