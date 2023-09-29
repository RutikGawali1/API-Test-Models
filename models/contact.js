const { INTEGER } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{

const Contact = sequelize.define('contact', {
    // Model attributes are defined here
    permanant_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    current_address: {
      type: DataTypes.STRING
      // allowNull defaults to true
    },
    UserId:{
      type:DataTypes.INTEGER,
      allowNull: false
    }
},{
  underscored: true
    
});
  return Contact;
}