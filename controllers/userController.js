
var db = require('../models')
var User = db.user;
var Contact = db.contact;
const { Sequelize,Op,QueryTypes } = require('sequelize');
var Education = db.education;


var addUser = async(req,res) => {
    const jane = await User.create({firstName: "Enter name" ,lastName: "Enter Name"});
    //const jane = User.build({ firstName: "Jane" ,lastName: "singh"});
    console.log(jane instanceof User); // true
    console.log(jane.firstName); // "Jane" 
    //jane.set({ firstName: "sangram" ,lastName: "lembe"});
    
    await jane.update({ firstName: "....." ,lastName: "......"});
    await jane.save();
    console.log('Jane was saved to the database!');
    //await jane.destroy();
    await jane.reload();
    console.log(jane.toJSON());
    res.status(200).json(jane.toJSON());
}

var getUsers = async (req, res) => {
    const data = await User.findAll({});
    res.status(200).json({data:data});
}
var getUser = async (req, res) => {
    const data = await User.findOne({
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});
       
}
var postUsers = async (req, res) => {
    var postData = req.body;
    if(postData.length>1){
        var data = await User.bulkCreate(postData);
    } else {
        var data = await User.create(postData);
        
    }
    
    res.status(200).json({data:data});
}
var deleteUser = async (req, res) => {
    const data = await User.destroy({
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});     
}

var patchUser = async (req, res) => {
    var updateData = req.body;
    const data = await User.update(updateData,{
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});
       
}
var queryUser = async (req, res) => {
    const data = await  User.count({
        where: {
          id: {
            [Op.gt]: 3
          }
        }

    });
    res.status(200).json({data:data});  
}

var findersUser = async (req, res) => {
    const {count, rows} = await  User.findAndCountAll({
        where: {lastName:'XYZ'}, 
           });
    res.status(200).json({data:rows,count:count});  
}

var getSetVirtualUser = async (req, res) => {
    const data = await  User.findAll({
        where: {lastName:'XYZ'}
    });
    // const data = await  User.create({
    //     firstName: 'satyam',
    //     lastName : 'kumar'
    // });
    res.status(200).json({data:data});  
}

var validateUser = async(req,res) => { 
    var data={};
    var messages={};
    try{
        data = await  User.create({
            firstName: 'a123',
            lastName: 'XYZ'
        });

    }catch(e){
        let message;
        e.errors.forEach(error=>{
            switch(error.validatorKey){
                case 'isAlpha':
                    message=error.message
                    break;
                case 'isLowercase':
                    message='Only lowercase are allowed'
                    break; 
                case 'len':
                        message='min 2 max 10 characterss allowed'
                        break;       

            }
            messages[error.path]=message
        })
    }
    res.status(200).json({data:data,message:messages}); 
}

var rawQueriesUser = async(req,res) =>{
    //const { QueryTypes } = require('sequelize');
    const users = await db.sequelize.query(
      'SELECT * FROM users WHERE id=$id',
        {
          bind:{id:1},//replacements: {search_name: 'abcd%'},
          type: QueryTypes.SELECT
        }
      );

    // const users = await db.sequelize.query("SELECT * FROM `users`",
    //  { type: QueryTypes.SELECT,
    //     model: User,
    //     mapToModel: true,// We didn't need to destructure the result here - the results were returned directly
    //     // If plain is true, then sequelize will only return the first
    //     // record of the result set. In case of false it will return all records.
    //     plain: true }); 
    res.status(200).json({data:users});

}
var oneToOneUser = async (req,res) => {
    // var data = await User.create({firstName:'hello',lastName:'ora'})
    // if(data && data.id){
    //     await Contact.create({ permanant_address:'wagholi',current_address:' ',
    //     'user_id':data.id})

    // }
    // var data = await User.findAll({
    //     attributes:['firstName','lastName'],
    //     include:[{
    //         model:Contact,
    //         as:'contactDetails',
    //         attributes:['permanant_address','current_address']
    //     }],
    //     where:{id:1}
    // })
    var data = await Contact.findAll({
        attributes:['permanant_address','current_address'],
        include:[{
            model:User,
            as:'usertDetails',
            attributes:['firstName','lastName']
        }],
        where:{id:1}
    })
    res.status(200).json({data:data});
}

var oneToManyUser = async(req,res) =>{
    //     await Contact.create({ permanant_address:'ABCD',current_address:'XYZ',
    //          'user_id':2})

    // var data = await User.findAll({
    //     attributes:['firstName','lastName'],
    //     include:[{
    //         model:Contact,
    //         as:'contactDetails',
    //         attributes:['permanant_address','current_address']
    //     }],
    // }) 
    var data = await Contact.findAll({
        attributes:['permanant_address','current_address'],
        include:[{
            model:User,
            as:'usertDetails',
            attributes:['firstName','lastName']
        }]
    })
    res.status(200).json({data:data});
}
var manyToManyUser = async(req,res) =>{
    var data = await User.create({firstName:'ABCD',lastName:'XYZ',status:0})
    if(data && data.id){
        await Contact.create({ permanant_address:'SDFH',current_address:'sdgh','UserId':data.id})
    }
    // var data = {}
    // var data = await Contact.findAll({
    //     attributes:['permanant_address','current_address'],
    //     include:[{
    //         model:User,
    //         attributes:['firstName','lastName']
    //     }]
    // })
    // var data = await User.findAll({
    //     attributes:['firstName','lastName'],
    //     include:[{
    //         model:Contact,
    //         attributes:['permanant_address','current_address']
    //     }],
    // })
    res.status(200).json({data:data});

}

var paranoidUser = async(req,res) =>{
    var data = await User.create({firstName:'ram',lastName:'sita'})
    var data = await User.destroy({
        where: {
          id: 2
        }
        //force: true //use for hard delete
      });
    var data = await User.restore();
    var data = await User.findAll({paranoid: false});
    //var data = await User.findByPk(2, { paranoid: false });

    res.status(200).json({data:data})

}

var loadingUser = async (req,res)=>{
    // var data = await User.create({firstName:'ABCD',lastName:'XYZ'})
    // if(data && data.id){
    //     await Contact.create({ permanant_address:'UVWZ',current_address:'XCBVS',UserId:data.id})
    // }
    var data = await User.findAll({
        attributes:['firstName','lastName'],
        include:[{
            model:Contact,
            attributes:['permanant_address','current_address']
        }],
    })
    //var contactData = await data.getContacts();//lazy loading
    //res.status(200).json({data:data,contactData:contactData});
    res.status(200).json({data:data});
}



var eagerUser = async (req,res) => {
    var data = await User.findAll({
        include:{
            model:Contact,
            include:{
                model:Education,
                where:{
                    id:1
                }

            }
        },
        where:{
            id:1
        }
        /*[{
            model:Contact,
            required: false,
            right:true
        },{
         model:Education   
        }]*/
    })
    res.status(200).json({data:data});

}

var creatorUser = async (req,res) => {
    // var data = await User.create({firstName:' ',lastName:' '})
    // if(data && data.id){
    //     await Contact.create({ permanant_address:'satara',current_address:'sagali',UserId:data.id})
    // }
    await Contact.bulkCreate([{
        permanant_address:'axy',
        current_address:'ghj',
        users:{
            firstName:'ABCD',
            lastName:'XUV'
        }
        
    },{
        permanant_address:'yza',
        current_address:'fgh',
        users:{
            firstName:'ABCD',
            lastName:'laba'
        }
        
    }],{
        include:[db.contactUser]
    })
        var data = await User.findAll({
            include:{
                model:Contact
            }
    })
    res.status(200).json({data:data});
 
}
var mnAssociationsUser = async(req,res) =>{
    
    // const amidala = await db.customer.create({ username: 'p4dm3', points: 1000 });
    // const queen = await db.profile.create({ name: 'Queen' });
    // await amidala.addProfile(queen, { through: { selfGranted: false } });
    // const result = await db.customer.findOne({
    //     where: { username: 'p4dm3' },
    //     include: db.profile
    // });

    // const amidala = await db.customer.create({
    //     username: 'p4dm3',
    //     points: 1000,
    //     profiles: [{
    //       name: 'Queen',
    //       User_Profile: {
    //         selfGranted: true
    //       }
    //     }]
    //   }, {
    //     include: db.profile
    //   });
      
    //   const result = await db.customer.findOne({
    //     where: { username: 'p4dm3' },
    //     include: db.profile
    //   });
      
      //console.log(result);


    // var result = await db.customer.findAll({
    //     include: 
    //       {
    //         model: db.grant,
    //         include: db.profile
    //       }
    //     });
        
        var result = await db.customer.findOne({
            include: {
              model:db.profile ,
              through: {
                attributes: []
              }
            }
          });
    res.status(200).json({data:result});
}

var m2m2mUser = async(req,res) =>{
    await db.player.bulkCreate([
        { username: 's0me0ne' },
        { username: 'empty' },
        { username: 'greenhead' },
        { username: 'not_spock' },
        { username: 'bowl_of_petunias' }
      ]);
      await db.game.bulkCreate([
        { name: 'The Big Clash' },
        { name: 'Winter Showdown' },
        { name: 'Summer Beatdown' }
      ]);
      await db.team.bulkCreate([
        { name: 'The Martians' },
        { name: 'The Earthlings' },
        { name: 'The Plutonians' }
      ]);
      await db.gameteam.bulkCreate([
        { GameId: 1, TeamId: 1 },   // this GameTeam will get id 1
        { GameId: 1, TeamId: 2 },   // this GameTeam will get id 2
        { GameId: 2, TeamId: 1 },   // this GameTeam will get id 3
        { GameId: 2, TeamId: 3 },   // this GameTeam will get id 4
        { GameId: 3, TeamId: 2 },   // this GameTeam will get id 5
        { GameId: 3, TeamId: 3 }    // this GameTeam will get id 6
      ]);
      await db.playerGameTeam.bulkCreate([
        // In 'Winter Showdown' (i.e. GameTeamIds 3 and 4):
        { PlayerId: 1, GameTeamId: 3 },   // s0me0ne played for The Martians
        { PlayerId: 3, GameTeamId: 3 },   // greenhead played for The Martians
        { PlayerId: 4, GameTeamId: 4 },   // not_spock played for The Plutonians
        { PlayerId: 5, GameTeamId: 4 }    // bowl_of_petunias played for The Plutonians
      ]);
      // Now we can make queries!
        const data = await db.game.findOne({
            where: {
            name: "Winter Showdown"
            },
            include: {
            model:  db.gameteam,
            include: [
                {
                model: db.player,
                through: { attributes: [] } // Hide unwanted `PlayerGameTeam` nested object from results
                },
                db.team
            ]
            }
        });


    res.status(200).json({data: data});
}
var scopeUser = async (req,res) =>{
    User.addScope('checkStatus',{
        where:{
            status:0
        }
    })
    User.addScope('checkStatus').findAll({
        where:{
            lastName:''
        }
    });
    res.status(200).json({data: data});
}

// var transactionsUser = async(req,res) =>{
//     var t = await db.sequelize.transaction();
//     var data = await User.create({firstName:' ',lastName:' '})
//     if(data && data.id){
//         try{
//             await Contact.create({ permanant_address:'TXy',
//             current_address:'sagali','UserId':null})

//             await t.commit();
//             console.log('commit')
//             //data['transaction_status']='commit';

//         }catch(error){
//             await t.rollback();
//            // data['transaction_status']='rollback';
//             console.log('rollback')
//             await User.destroy({where:{
//                id:data.id 
//             }})
//         }
        
//     }
//     res.status(200).json({data: data});
// }
var transactionsUser = async(req,res) =>{

    try {

        const result = await db.sequelize.transaction(async (t) => {
          var contact = await Contact.create({
            permanant_address:'ddfg',
            current_address:'GHJK',
            users:{
                firstName:'GHJT',
                lastName:'LKJH'
            }
        },{
            include:[db.contactUser]
        })    
          return contact;
      
        });
        console.log('result',result)
        
      } catch (error) {
        console.log('error:'+error.message)
        // await User.destroy({where:{
        //                    id:data.id 
        //                 }})
      
        
      }
    res.status(200).json({data:{}});
}
var hooksUser = async(req,res) =>{

    var data = await User.create({firstName:'HJTR',lastName:'SDXZ',status:1})

    res.status(200).json({data:data});

}
var Image = db.image;
var Video = db.video;
var Comment = db.comment;
var Tag = db.tag;
var TagTaggable = db.tagTaggable;
var polyOneTwoManyUsers = async(req,res) =>{
    //var imageData = await Image.create({title:'First Image',url:'First_url'})
    // var imageData = {};
    // var videoData = await  Video.create({title:'Second VIdeo',text:'Awesome video'})
    // if(imageData.id && imageData.id){
    //     await Comment.create({title:'First Comment for image',
    //     commentableId:imageData.id,commentableType:'image'});
        
    // }if(videoData.id && videoData){
    //     await Comment.create({title:'Second Comment for video',
    //     commentableId:videoData.id,commentableType:'video'});
    // }

    //image to comment 
    var imageCommentData = await Image.findAll({
        include:[{
            model: Comment
        }]
    })

    // var videoCommentData = await Video.findAll({
    //     include:[{
    //         model: Comment
    //     }]
    // })

    // var CommentData = await Comment.findAll({
    //     include:[{
    //         model: Video
    //     }]
    // })

    // var imageCommentData = await Comment.findAll({
    //     include:[Image]
    // })

    res.status(200).json({data: imageCommentData });

}

var polyManyToManyUsers = async(req,res) =>{
  /* var data ={}
    var imageData = await Image.create({title:'second Image',url:'First_url'})
    var videoData = await Video.create({title:'react Video',text:'Awesome video'})
    var tagData = await Tag.create({name:'angular'})
    if(tagData && tagData.id && imageData.id){
        await TagTaggable.create({tagId: tagData.id,
        taggableId:imageData.id,taggableType:'image'});
    }    
    if(tagData && tagData.id && videoData && videoData.id){
        await TagTaggable.create({tagId: 2, //tagData.id,
        taggableId:videoData.id,taggableType:'video'});
    }*/

    // var data = await Image.findAll({
    //     include:[tag]
    // })
    var data = await Tag.findAll({
            include:[Image,Video]
        })
    

    res.status(200).json({data:data});

}

var queryinterfaceUsers = async(req,res)=>{
    var data ={}
    const queryInterface = db.sequelize.getQueryInterface();
    // queryInterface.createTable('Person', {
    //     name: db.DataTypes.STRING,
    //     isBetaMember: {
    //       type: db.DataTypes.BOOLEAN,
    //       defaultValue: false,
    //       allowNull: false
    //     }
    //   });
    
    // queryInterface.addColumn('Person', 'foo', { type: db.DataTypes.INTEGER });

    // queryInterface.changeColumn('Person', 'foo', {
    //     type: db.DataTypes.FLOAT,
    //     defaultValue: 3.14,
    //     allowNull: false
    //   });

    queryInterface.removeColumn('Person', 'petName', { /* query options */ });
    res.status(200).json({data:data});
}
async function makePostWithReactions(content, reactionTypes) {
    const post = await db.post.create({ content });
    await db.reaction.bulkCreate(
        reactionTypes.map(type => ({ type, postId: post.id }))
    );
    return post;
}

var subQueryUsers = async(req,res)=>{

    // var data = await makePostWithReactions('Hello World', [
    //     'Like', 'Angry', 'Laugh', 'Like', 'Like', 'Angry', 'Sad', 'Like'
    // ]);
    // await makePostWithReactions('My Second Post', [
    //     'Laugh', 'Laugh', 'Like', 'Laugh'
    // ]);
    var data = await db.post.findAll({
        attributes: {
            include: [
                [
                    // Note the wrapping parentheses in the call below!
                    db.sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM reactions AS reaction
                        WHERE
                            reaction.postId = post.id
                            AND
                            reaction.type = "Laugh"
                    )`),
                    'laughReactionsCount'
                ]
            ]
        },
        order: [
            [db.sequelize.literal('laughReactionsCount'), 'DESC']
        ]
    
    });

    res.status(200).json({data:data});
}


module.exports= { 
    addUser,
    getUsers,
    getUser,
    postUsers,
    deleteUser,
    patchUser,
    queryUser,
    findersUser,
    getSetVirtualUser,
    validateUser,
    rawQueriesUser,
    oneToOneUser,
    oneToManyUser,
    manyToManyUser,
    paranoidUser,
    loadingUser,
    eagerUser,
    creatorUser,
    mnAssociationsUser,
    m2m2mUser,
    scopeUser,
    transactionsUser,
    hooksUser,
    polyOneTwoManyUsers,
    polyManyToManyUsers,
    queryinterfaceUsers,
    subQueryUsers

}