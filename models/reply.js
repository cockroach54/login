'use strict';
module.exports = (sequelize, DataTypes) => {
  const reply = sequelize.define('reply', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  reply.associate = function(models) {
    // associations can be defined here
    reply.belongsTo(models.post, {
      foreignKey: "postId"
    });
  };
  return reply;
};