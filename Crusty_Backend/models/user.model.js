const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Review, {
        foreignKey: 'user_id',
        as: 'reviews'
      });
      User.hasMany(models.Participate, {
        foreignKey: 'user_id',
        as: 'participations'
      });
      User.hasMany(models.Vote, {
        foreignKey: 'user_id',
        as: 'votes'
      });
      User.hasMany(models.UserDietaryNeeds, {
        foreignKey: 'user_id',
        as: 'dietaryNeeds'
      });
    }
  }

  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    profile_picture_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'user'
    },
    date_joined: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  return User;
};