//const {DataTypes,Model } = require('sequelize');
//const sequelize = require('./index')
module.exports = (sequelize,DataTypes,Model) => {
class User extends Model {}

User.init({ 
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{
      isAlpha:{
        msg: 'Only alphabegs are allowed'
        
      },         // will only allow letter
      isLowercase: true,   // checks for lowercase
      len: [2,10]  //condition for name limit

    },
    get() {
      const rawValue = this.getDataValue('firstName');//upper case
      return rawValue ? 'Mr.' + rawValue.toUpperCase() : null;
    }
  },
  lastName: {
    type: DataTypes.STRING,
    defaultValue:'ABCD',
    set(value) {
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      this.setDataValue('lastName', value+' Indian');
    }
    // allowNull defaults to true
  },
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;//full name
    },
    set(value) {
      throw new Error('Do not try to set the `fullName` value!');
    }
  },
  status:DataTypes.INTEGER
},  
/*{
  hooks: {
    beforeValidate: (user, options) => {
      user.lastName = 'happy';
    },
    afterValidate: (user, options) => {
      user.status = 1;
    }
  },
  sequelize
},*/
{
  underscored: true,
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User', // We need to choose the model name
  //paranoid: true,
  //deletedAt: 'soft_delete'
}); 


// Method 2 via the .addHook() method
/*User.addHook('beforeValidate', (user, options) => {
  user.lastName = 'happy';
});

User.addHook('afterValidate', 'someCustomName', (user, options) => {
  user.status=1
});*/


// Method 3 via the direct method
User.beforeValidate(async (user, options) => {
  user.lastName = 'rocky';
});

User.afterValidate('myHookAfter', (user, options) => {
  user.status = 0;
});


User.removeHook('afterCreate', 'notifyUsers');


return User;
}





// the defined model is the class itself
//console.log(User === sequelize.models.User); // true



//this is old code 

/*const {DataTypes } = require('sequelize');
const sequelize = require('./index')


const User = sequelize.define('User', {
// Model attributes are defined here
firstName: {
  type: DataTypes.STRING,
  allowNull: false
},
lastName: {
  type: DataTypes.STRING,
  defaultValue: "John Doe"
  // allowNull defaults to true
}
}, {
// Other model options go here
tableName: 'users',
timestamps: false,
//createdAt: false,
//updatedAt: 'update_at'


});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

module.exports = User */