var express   = require('express');
var router    = express.Router();
var log = require('../config/winston');
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

// TODO: Email belum di kasih regex
router.post('/user/register', (req,res) => {
    let {name,email,username,password} = req.body
    
    knex.select("username").from("user").where("username", username).then(data => {
        // console.log(data)
        if(data.length > 0){
            log.error('Username '+ username + ' Already in Use')
            console.log('Username '+ username + ' Already in Use')

            res.status(409).send({
                success : false,
                message : "Username Already in Use"
            })
        }else{
            knex.from("user").select("email").where("email", email).then(data1 => {
                // console.log(data1)
                if(data1.length > 0){
                    log.error('Email '+ email + ' Already in Use')
                    console.log('Email '+ email + ' Already in Use')

                    res.status(409).send({
                        success : false,
                        message : "Email Already in Use"
                    })
                }else{
                    knex('user').insert({name,email,username,password}).then(data2 => {
                        // console.log(data2)
                        knex('user').select('id_user').where('username', username).then(data3 => {
                            // console.log(data3[0])

                            let idUser = data3[0].id_user

                            res.status(200).send({
                                success: true, 
                                id: idUser
                            })
                        })
                    }).catch(err => {
                        log.error(err)
                        console.log(err)
                    })
                }
            })
        }
    })
})

router.post('/user/login', (req,res) => {
    let {username,email,password} = req.body

    knex('user').where('username', username).orWhere('email', email).select('id_user').then(data => {
        // console.log(data)
        if(data.length === 0){
            log.error('Not Found Username or Email in System')
            console.log('Not Found Username or Email in System')

            res.status(404).send({
                success: false,
                message: 'Incorrect Username,email or Password'
            })
        }else{
            knex('user').where('password', password).select('id_user').then(data1 => {
                // console.log(data1[0].id_user)
                if(data1.length === 0){
                    log.error('Password Incorrect')
                    console.log('Password Incorrect')

                    res.status(404).send({
                        success: false,
                        message: 'Incorrect Username,email or Password'
                    })
                }else{
                    let idUser = data1[0].id_user
                    
                    res.status(200).send({
                        success: true,
                        id: idUser
                    })
                }
            })
        }
    })
})

// TODO: Target sudah ada, tapi terkumpul belum dibuat
router.get('/usaha', (req,res) => {
    knex('business').select('id_business','business_name','target','terkumpul','domisili','description','photo').then(data => {
        // console.log(data)
        res.status(200).send({
            success : true,
            data
        })
    }).catch(err => {
        log.error(err)
        console.log(err)

        res.status(503).send({
            success : false
        })
    })
})
// router.post('/login', (req,res) => {
// // router.post('/login', (req,res) => {
//         var username = req.body.username
//         var password = req.body.password
    
//         knex('Users').where({
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

module.exports = router