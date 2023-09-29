module.exports = (sequelize,DataTypes,Model) => {
class Tag extends Model {

   }
   Tag.init({
     name: DataTypes.STRING
   }, { sequelize, modelName: 'tag' });
   return Tag;
}