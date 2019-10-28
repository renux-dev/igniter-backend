var express   = require('express');
var router    = express.Router();
// var moment    = require('moment-timezone');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : 'remotemysql.com',
        user : 'OmZxYRRUzD',
        password : 'Xl0XYzktCJ',
        database : 'OmZxYRRUzD'
    }
});

router.get('/test', (req,res) => {
    console.log("test")
    knex.raw('select * from ayam').then(data => {
        res.send(data[0])
    })
})

router.post('/login', (req,res) => {
// router.post('/login', (req,res) => {
        var username = req.body.username
        var password = req.body.password
    
        knex('Users').where({
            username: username
        }).select('id','username','password').then(data =>{
            // if(data[0][2] !== password){
            //     console.log(data[0][0])
            if(data[0].password == password){
                res.send({
                    success : true,
                    data : {id : data[0].id}
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

router.get('/register', (req,res) => {
    var username = req.body.username
    var password = req.body.password
    var email  = req.body.email
    
    knex.select("username").from("Users").where("username", username).then(data => {
        if (data.length === 0) {
            knex('Users').insert({username,email,password}).then((newUserId) => {
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

module.exports = router