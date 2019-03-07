'use strict';

function isValidId(emailId) {
  for (let i = 0; i < emailId.length; i++) {
    let result = emailId[i].match(/\w/g)
    if (result === null) {
      return false;
    }
  }
  return true;
}

function isValidDomain(domain) {
  let googleDomain = "@gmail.com";

  if (googleDomain === domain) {
    return true;
  }
  else {
    return false;
  }
}

module.exports = (sequelize, DataTypes) => {
  var std = sequelize.define('std', {
    stdEmail: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        isGmail(inputEmail) {
          let inputEmailId = inputEmail.slice(0, -10);
          let inputEmailDomain = inputEmail.slice(-10).toLowerCase();

          if (!isValidId(inputEmailId) || !isValidDomain(inputEmailDomain)) {
            throw new Error("이메일 형식이 맞지 않습니다.")
          }
        }
      }
    },
    stdName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stdPwd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING
    },
  });
  return std;
};
