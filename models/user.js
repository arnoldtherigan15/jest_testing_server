'use strict';
let bcrypt = require('bcryptjs');


module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  class User extends Model {}
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'invalid email format'
        },
        notEmpty: {
          args: true,
          msg: 'email is reguired'
        },
        notNull: {
          args: true,
          msg: 'email is required'
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'password is reguired'
        },
        len: {
          args: [6],
          msg: 'password minimal 6 char'
        }
      }
    }    
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user,opt) => {
        let salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);    
      }
    }
  })

  return User;
};