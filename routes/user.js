var express   = require('express');
var router    = express.Router();
// var moment    = require('moment-timezone');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : 'remotemysql.com',
        user : 'WtaqzmYpZH',
        password : 'c908HTDGbU',
        database : 'WtaqzmYpZH'
    }
});

router.get('/test', (req,res) => {
    console.log("Hello World")
    res.status(200).send({
        success : true
    })
})

// router.post('/login', (req,res) => {
// // router.post('/login', (req,res) => {
//         var username = req.body.username
//         var password = req.body.password
    
//         knex('investor, ').where({
//             username: username
//         }).select('id','username','password').then(data =>{
//             // if(data[0][2] !== password){
//             //     console.log(data[0][0])
//             if(data[0].password == password){
//                 res.send({
//                     success : true,
//                     data : {id : data[0].id}
//                 })
//             }else{
//                 console.log('gagal')
//                 res.send({
//                     success : false
//                 })
//             }
//         // }
//     }).catch(err => {
//         res.send({
//             success : false
//         })
//         //console.log(err) //uncomment to see err
//     })
// })

// router.get('/register', (req,res) => {
//     var username = req.body.username
//     var password = req.body.password
//     var email  = req.body.email
//     var name  = req.body.name

    
//     knex.select("username").from("business").where("username", username).then(data => {
//         if (data.length === 0) {
//             knex('Users').insert({username,name,email,password}).then((newUserId) => {
//                 res.send({
//                     success: true, 
//                     id: newUserId[0]
//                 })
//             })
//         }else{
//             res.send({
//                 success : false
//             })
//         }
//     })

// })

router.post('/register-business', (req,res) => {
    var username = req.body.username
    var password = req.body.password
    var email  = req.body.email
    var name  = req.body.name

    
    knex.select("username").from("business").where("username", username).then(data => {
        if (data.length === 0) {
            knex('business').insert({username,name,email,password}).then((newUserId) => {
                res.send({
                    success: true, 
                    id: newUserId[0]
                })
            })
        }else{
            res.send({
                success : false
            })
        }
    })
})
router.post('/login-business', (req,res) => {
        var username = req.body.username
        var password = req.body.password
    
        knex("business")
        .where("username", username).orWhere("email", username)
        .select("id_business","username","password")
        .then(data =>{
            if(data[0].password == password){
                res.send({
                    success : true,
                    data : {id : data[0].id_business}
                })
            }else{
                console.log('gagal')
                res.send({
                    success : false
                })
            }
        // }
    }).catch(err => {
        res.send({
            success : false
        })
        //console.log(err) //uncomment to see err
    })
})

module.exports = router