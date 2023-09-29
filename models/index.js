const {Sequelize, DataTypes, Model } = require('sequelize');
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('Database Name', 'user','Password', {
    host: 'localhost',
    logging: false,
    // pool: {
    //   max: 100,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // },
    dialect:'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });


  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const db = {};
  db.Sequelize=Sequelize;
  db.sequelize = sequelize;
  
  
  db.user = require('./user')(sequelize,DataTypes,Model);
  db.contact = require('./contact')(sequelize,DataTypes);
  db.education = require('./education')(sequelize,DataTypes);
  db.customer = require('./customer')(sequelize,DataTypes);
  db.profile = require('./profile')(sequelize,DataTypes);
  db.userContacts = require('./userContacts')(sequelize,DataTypes,db.user,db.contact );

  const Grant = sequelize.define('grant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    selfGranted: DataTypes.BOOLEAN,
  }, { timestamps: false });

  db.grant=Grant;
  
  db.customer.belongsToMany(db.profile, { through: Grant, uniqueKey: 'my_custom_unique'});
  db.profile.belongsToMany(db.customer, { through: Grant });

  // Setup a One-to-Many relationship between User and Grant
  // db.customer.hasMany(Grant);
  // Grant.belongsTo( db.customer); 
  // // Also setup a One-to-Many relationship between Profile and Grant
  // db.profile.hasMany(Grant);
  // Grant.belongsTo(db.profile);
  

  // db.user.hasOne(db.contact,{foreignKey:'user_id',as:'contactDetails'});//creating relation
  // db.contact.belongsTo( db.user,{foreignKey:'user_id',as:'usertDetails'});

  db.user.hasMany(db.contact);//creating relation
  db.contactUser = db.contact.belongsTo(db.user);//,{foreignKey:'user_id',as:'usertDetails'}

  db.contact.hasMany(db.education,{foreignKey:'ContactId'});
  db.education.belongsTo(db.user,{foreignKey:'UserId'});

// db.user.belongsToMany(db.contact, { through: db.userContacts});
// db.contact.belongsToMany(db.user, { through: db.userContacts});

db.player = sequelize.define('Player', { username: DataTypes.STRING });
db.team = sequelize.define('Team', { name: DataTypes.STRING });
db.game = sequelize.define('Game', { name: DataTypes.STRING });

db.gameteam = sequelize.define('GameTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});
db.team.belongsToMany(db.game, { through: db.gameteam });
db.game.belongsToMany(db.team, { through: db.gameteam });
db.gameteam.belongsTo(db.game);
db.gameteam.belongsTo(db.team);
db.game.hasMany(db.gameteam);
db.team.hasMany(db.gameteam);

// Super Many-to-Many relationship between Player and GameTeam
db.playerGameTeam = sequelize.define('PlayerGameTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});
db.player.belongsToMany(db.gameteam, { through: db.playerGameTeam });
db.gameteam.belongsToMany(db.player, { through: db.playerGameTeam });
db.playerGameTeam.belongsTo(db.player);
db.playerGameTeam.belongsTo(db.gameteam);
db.player.hasMany(db.playerGameTeam);
db.gameteam.hasMany(db.playerGameTeam);

db.image = require('./image')(sequelize,DataTypes,Model);
db.video = require('./video')(sequelize,DataTypes,Model);
db.comment = require('./comment')(sequelize,DataTypes,Model);
db.tag = require('./tag')(sequelize,DataTypes,Model);
db.tagTaggable = require('./tag_taggable')(sequelize,DataTypes,Model);


db.image.hasMany(db.comment, {
  foreignKey: 'commentableId',
  constraints: false,
  scope: {
    commentableType: 'image'
  }
});
db.comment.belongsTo(db.image, { foreignKey: 'commentableId', constraints: false });

db.video.hasMany(db.comment, {
  foreignKey: 'commentableId',
  constraints: false,
  scope: {
    commentableType: 'video'
  }
});
db.comment.belongsTo(db.video, { foreignKey: 'commentableId', constraints: false });

db.image.belongsToMany(db.tag, {
  through: {
    model: db.tagTaggable,
    unique: false,
    scope: {
      taggableType: 'image'
    }
  },
  foreignKey: 'taggableId',
  constraints: false
});
db.tag.belongsToMany(db.image, {
  through: {
    model: db.tagTaggable,
    unique: false
  },
  foreignKey: 'tagId',
  constraints: false
});


db.video.belongsToMany(db.tag, {
  through: {
    model: db.tagTaggable,
    unique: false,
    scope: {
      taggableType: 'video'
    }
  },
  foreignKey: 'taggableId',
  constraints: false
});


db.tag.belongsToMany(db.video, {
  through: {
    model: db.tagTaggable,
    unique: false
  },
  foreignKey: 'tagId',
  constraints: false
});


db.post = sequelize.define('post', {
  content: DataTypes.STRING
}, { timestamps: false });

db.reaction = sequelize.define('reaction', {
  type: DataTypes.STRING
}, { timestamps: false });

db.post.hasMany(db.reaction );
db.reaction .belongsTo(db.post);

db.DataTypes = DataTypes

  db.sequelize.sync({force: false});
  module.exports = db