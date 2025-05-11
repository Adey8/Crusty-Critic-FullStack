const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Comment.belongsTo(models.Poll, {
        foreignKey: 'poll_id',
        as: 'poll'
      });
    }
  }

  Comment.init({
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'polls',
        key: 'poll_id'
      }
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    underscored: true
  });

  return Comment;
}; 