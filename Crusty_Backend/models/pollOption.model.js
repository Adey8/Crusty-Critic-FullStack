const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PollOption extends Model {
    static associate(models) {
      PollOption.belongsTo(models.Poll, {
        foreignKey: 'poll_id',
        as: 'poll'
      });

      PollOption.hasMany(models.Vote, {
        foreignKey: 'option_id',
        as: 'votes'
      });
    }
  }

  PollOption.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'polls',
        key: 'poll_id'
      }
    }
  }, {
    sequelize,
    modelName: 'PollOption',
    tableName: 'poll_options',
    timestamps: true,
    underscored: true
  });

  return PollOption;
};