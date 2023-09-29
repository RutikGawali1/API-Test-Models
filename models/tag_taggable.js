// Here we define the junction model explicitly
module.exports = (sequelize,DataTypes,Model) => {
class Tag_Taggable extends Model {}
Tag_Taggable.init({
  tagId: {
    type: DataTypes.INTEGER,
    unique: 'tt_unique_constraint'
  },
  taggableId: {
    type: DataTypes.INTEGER,
    unique: 'tt_unique_constraint',
    references: null
  },
  taggableType: {
    type: DataTypes.STRING,
    unique: 'tt_unique_constraint'
  }
}, { sequelize, modelName: 'tag_taggable' });
return Tag_Taggable;
}