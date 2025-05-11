const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Challenge extends Model {
    static associate(models) {
      Challenge.hasMany(models.Participate, {
        foreignKey: 'challenge_id',
        as: 'participants'
      });
      
      Challenge.hasOne(models.Poll, {
        foreignKey: 'challenge_id',
        as: 'poll'
      });
    }
  }

  Challenge.init({
    challenge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    challenge_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Challenge',
    tableName: 'challenges',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Challenge;
};