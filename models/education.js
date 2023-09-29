module.exports=(sequelize,DataTypes)=>{

const Education = sequelize.define('educations', {
    // Model attributes are defined here
    class_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passing_year: {
      type: DataTypes.INTEGER
      // allowNull defaults to true
    },
    ContactId:DataTypes.INTEGER
});
return Education;
}