var express = require('express');
var router = express.Router();
// var moment    = require('moment-timezone');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'remotemysql.com',
        user: 'WtaqzmYpZH',
        password: 'c908HTDGbU',
        database: 'WtaqzmYpZH'
    }
});

router.get('/test', (req, res) => {
    console.log("Hello World")
    res.status(200).send({
        success: true
    })
})

router.get('/', (req, res) => {
    knex('business')
        .select()
        .then(data => {
            console.log(data)
            res.send({
                success: true
            })
        }).catch(err => {
            console.log(err)
            res.send({
                success: false
            })
        })
})
router.get('/profile/:id_business', (req, res) => {
    var id_business = req.params.id_business

    knex('business')
        .select()
        .where("id_business", id_business)
        .then(data => {
            console.log(data)
            res.send({
                success: true
            })
        }).catch(err => {
            console.log(err)
            res.send({
                success: false
            })
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

router.post('/register-business', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var name = req.body.name


    knex.select("username").from("business").where("username", username).orWhere("email", email).then(data => {
        if (data.length === 0) {
            knex('business').insert({ username, name, email, password }).then((newUserId) => {
                res.send({
                    success: true,
                    id: newUserId[0]
                })
            })
        } else {
            res.send({
                success: false
            })
        }
    })
})
router.post('/login-business', (req, res) => {
    var username = req.body.username
    var password = req.body.password

    knex("business")
        .where("username", username).orWhere("email", username)
        .select("id_business", "username", "password")
        .then(data => {
            if (data[0].password == password) {
                res.send({
                    success: true,
                    data: { id: data[0].id_business }
                })
            } else {
                console.log('gagal')
                res.send({
                    success: false
                })
            }
            // }
        }).catch(err => {
            res.send({
                success: false
            })
        })
})

router.post('/add-description/:id_business', (req, res) => {
    var business_name = req.body.business_name
    var domisili = req.body.domisili
    var description = req.body.description
    var id_business = req.params.id_business

    knex('business')
        .where("id_business", id_business)
        .update({ business_name, domisili, description })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            res.send({
                success: false
            })
            console.log(err)
        })
})

router.post('/insert-target/:id_business', (req, res) => {
    var target = req.body.target
    var id_business = req.params.id_business

    knex('business')
        .where("id_business", id_business)
        .update({ target })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            res.send({
                success: false
            })
            console.log(err)
        })
})

router.post('/add-record/', (req, res) => {
    var total = req.body.total
    var month = req.body.month
    var id_business = req.body.id_business
    var create_at = knex.fn.now();

    knex('track_record')
        .insert({ id_business, month, create_at, total })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            res.send({
                success: false
            })
            console.log(err)
        })
})

router.post('/update-record/:id_track', (req, res) => {
    var total = req.body.total
    var id_track = req.params.id_track
    var create_at = knex.fn.now();

    knex('track_record')
        .insert({ id_track, month, create_at, total })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            res.send({
                success: false
            })
            console.log(err)
        })
})

router.post('/upload-doc', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    var id_business = req.body.id_business
    var file = req.files.photo
    var photo = file.name

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        file.mv('uploads/documentations/' + photo, (err) => {
            if (err) {
                res.send({
                    success: false,
                    msg: "FILE KOSONG"
                })
            } else {
                knex('documentation')
                    .insert({ id_business, photo })
                    .then((data) => {
                        console.log(data)
                        res.send({
                            status: true
                        })
                    }).catch(err => {
                        res.send({
                            status: false,
                            msg: "SALAH EGE UPLOADNYA"
                        })
                    })
            }
        })
    }
})

router.post('/upload-header/:id_business', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    var id_business = req.params.id_business
    var file = req.files.img
    var photo = file.name

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        file.mv('uploads/header/' + photo, (err) => {
            if (err) {
                res.send({
                    success: false,
                    msg: "FILE KOSONG"
                })  
            } else {
                knex('business')
                    .where("id_business", id_business)
                    .update({ photo })
                    .then((data) => {
                        console.log(data)
                        res.send({
                            status: true
                        })
                    }).catch(err => {
                        console.log(err)
                        res.send({
                            status: false,
                            msg: "SALAH EGE UPLOADNYA"
                        })
                    })
            }
        })
    }
})

router.post('/upload-attach', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    var id_business = req.body.id_business
    var file = req.files.attach
    var attach = file.name

    file.mv('uploads/attachments/' + attach, (err) => {
        if (err) {
            res.send({
                success: false,
                msg: "FILE KOSONG"
            })
        } else {
            knex('attachment')
                .insert({ id_business: id_business, file: attach })
                .then((data) => {
                    console.log(data)
                    res.send({
                        status: true
                    })
                }).catch(err => {
                    console.log(err)
                    res.send({
                        status: false,
                        msg: "SALAH EGE UPLOADNYA"
                    })
                })
        }
    })

})

module.exports = router