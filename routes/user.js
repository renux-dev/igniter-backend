var express = require('express');
var fuzzy = require('fuzzylogic');
var router = express.Router();
var log = require('../config/winston');
var moment = require('moment-timezone');

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

// router.get('/', (req, res) => {
//     knex('business')
//         .select()
//         .then(data => {
//             console.log(data)
//             res.send({
//                 success: true
//             })
//         }).catch(err => {
//             console.log(err)
//             res.send({
//                 success: false
//             })
//         })
// })

router.get('/business/profile/:id_business', (req, res) => {
    var id_business = req.params.id_business

    knex('business')
        .select()
        .where("id_business", id_business)
        .then(profiles => {
            profile = []
            profiles.map((value) => {
                profile.push({
                    "id_business": value.id_business,
                    "username": value.username,
                    "name": value.name,
                    "email": value.email,
                    "password": value.password,
                    "business_name": value.business_name,
                    "target": value.target,
                    "domisili": value.domisili,
                    "description": value.description,
                    "photo": value.photo,
                    "status": value.status,
                    "valuasi": value.valuasi,
                    "url": "https://igniter.herokuapp.com/uploads/header/" + value.photo
                })
            })
            knex('documentation')
                .select()
                .where("id_business", id_business)
                .andWhere('deleted', false)
                .then(documentations => {

                    docs = []
                    documentations.map((value) => {
                        docs.push({
                            "id_business": value.id_business,
                            "id_documentation": value.id_documentation,
                            "photo": value.photo,
                            "deleted": value.deleted,
                            "url": "https://igniter.herokuapp.com/uploads/documentations/" + value.photo
                        })
                    })

                    knex('track_record')
                        .select()
                        .where("id_business", id_business)
                        .andWhere('deleted', false)
                        .then(tracks => {

                            arrMonth = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
                            arrTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            for (i = 0; i < 12; i++) {
                                if (tracks[i]) {
                                    arrTotal[tracks[i].month - 1] = tracks[i].total
                                }
                            }
                            var track = { arrMonth, arrTotal }

                            knex('attachment')
                                .select()
                                .where("id_business", id_business)
                                .andWhere('deleted', false)
                                .then(attach_file => {

                                    attachments = []
                                    attach_file.map((index) => {
                                        attachments.push({
                                            "id_business": index.id_business,
                                            "id_attachment": index.id_attachment,
                                            "file": index.file,
                                            "deleted": index.deleted,
                                            "url": "https://igniter.herokuapp.com/uploads/attachments/" + index.file
                                        })
                                    })

                                    knex('investment')
                                        .select()
                                        .where("id_business", id_business)
                                        .andWhere('deleted', false)
                                        .then(investments => {
                                            // console.log(profile)
                                            // console.log(docs)
                                            // console.log(track)
                                            // console.log(attachments)
                                            // console.log(investments)

                                            total = 0
                                            count = 0
                                            investments.map(function (index) {
                                                total += index.total
                                                count += 1
                                            })

                                            invest = { "total": total, "investor": count }
                                            res.send({
                                                success: true,
                                                profile: profile[0],
                                                docs,
                                                track,
                                                attachments,
                                                invest
                                            })
                                        }).catch(err => {
                                            console.log(err)
                                            res.send({
                                                success: false
                                            })
                                        })

                                }).catch(err => {
                                    console.log(err)
                                    res.send({
                                        success: false
                                    })
                                })

                        }).catch(err => {
                            console.log(err)
                            res.send({
                                success: false
                            })
                        })
                }).catch(err => {
                    console.log(err)
                    res.send({
                        success: false
                    })
                })

        }).catch(err => {
            console.log(err)
            res.send({
                success: false
            })
        })
})
router.get('/business/profile', (req, res) => {

    knex('business')
        .select()
        .where("status", false)
        .then(profiles => {

            profile = []
            profiles.map((value) => {
                profile.push({
                    "id_business": value.id_business,
                    "username": value.username,
                    "name": value.name,
                    "email": value.email,
                    "password": value.password,
                    "business_name": value.business_name,
                    "target": value.target,
                    "terkumpul": value.terkumpul,
                    "domisili": value.domisili,
                    "description": value.description,
                    "photo": value.photo,
                    "status": value.status,
                    "valuasi": value.valuasi,
                    "url": "https://igniter.herokuapp.com/uploads/header/" + value.photo,
                })
            })

            knex('investment')
                .select()
                .where('deleted', false)
                .then(investments => {
                    // console.log(profiles)
                    // console.log(investments)
                    var invest = []

                    profiles.forEach((prof, i) => {
                        var total = 0
                        var count = 0
                        investments.forEach((inv, j) => {
                            if (prof.id_business === inv.id_business) {
                                count += 1
                                total = inv.total
                            }
                        })
                        invest.push({ "id_business": prof.id_business, "total": total, "investor": count })
                    })
                    // console.log(invest)
                    res.send({
                        success: true,
                        profile,
                        invest
                    })
                }).catch(err => {
                    console.log(err)
                    res.send({
                        success: false
                    })
                })
        }).catch(err => {
            console.log(err)
            res.send({
                success: false
            })
        })
})
// router.get('/business/documentation/:id_business', (req, res) => {
//     var id_business = req.params.id_business

//     knex('documentation')
//         .select()
//         .where("id_business", id_business)
//         .andWhere('deleted', false)
//         .then(data => {
//             console.log(data)
//             res.send({
//                 success: true,
//                 documentation: data
//             })
//         }).catch(err => {
//             console.log(err)
//             res.send({
//                 success: false
//             })
//         })
// })
router.post('/user/kuisioner', (req, res) => {
    var page1 = req.body.page1
    var page2 = req.body.page2
    var page3 = req.body.page3
    var page4 = req.body.page4

    var total = page1 + page2 + page3 + page4
    // console.log(total)
    var profilling = (total) => {
        return fuzzylogic.trapezoid(threat, 0, 33, 76, 100);
    };

})
// router.get('/business/track/:id_business', (req, res) => {
//     var id_business = req.params.id_business

//     knex('track_record')
//         .select()
//         .where("id_business", id_business)
//         .andWhere('deleted', false)
//         .then(data => {
//             // console.log(data)
//             arrMonth = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
//             arrTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//             for (i = 0; i < 12; i++) {
//                 if (data[i]) {
//                     arrTotal[data[i].month - 1] = data[i].total
//                 }
//             }
//             console.log(arrTotal)
//             res.send({
//                 success: true,
//                 data: { arrMonth, arrTotal }
//             })
//         }).catch(err => {
//             console.log(err)
//             res.send({
//                 success: false
//             })
//         })
// })
// router.get('/business/attachment/:id_business', (req, res) => {
//     var id_business = req.params.id_business

//     knex('attachment')
//         .select()
//         .where("id_business", id_business)
//         .andWhere('deleted', false)
//         .then(data => {
//             console.log(data)
//             res.send({
//                 success: true,
//                 data: data
//             })
//         }).catch(err => {
//             console.log(err)
//             res.send({
//                 success: false
//             })
//         })
// })
// router.get('/business/investment/:id_business', (req, res) => {
//     var id_business = req.params.id_business

//     knex('investment')
//         .select()
//         .where("id_business", id_business)
//         .andWhere('deleted', false)
//         .then(data => {
//             console.log(data)
//             total = 0
//             count = 0
//             data.map(function (index) {
//                 total += index.total
//                 count += 1
//             })
//             res.send({
//                 success: true,
//                 // data : data,
//                 total: total,
//                 count: count
//             })
//         }).catch(err => {
//             console.log(err)
//             res.send({
//                 success: false
//             })
//         })
// })
// TODO: Email belum di kasih regex
router.post('/user/register', (req, res) => {
    let { name, email, username, password } = req.body

    knex.select("username").from("user").where("username", username).then(data => {
        // console.log(data)
        if (data.length > 0) {
            log.error('Username ' + username + ' Already in Use')
            console.log('Username ' + username + ' Already in Use')

            res.status(409).send({
                success: false,
                message: "Username Already in Use"
            })
        } else {
            knex.from("user").select("email").where("email", email).then(data1 => {
                // console.log(data1)
                if (data1.length > 0) {
                    log.error('Email ' + email + ' Already in Use')
                    console.log('Email ' + email + ' Already in Use')

                    res.status(409).send({
                        success: false,
                        message: "Email Already in Use"
                    })
                } else {
                    knex('user').insert({ name, email, username, password }).then(data2 => {
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

router.post('/user/login', (req, res) => {
    let { username, email, password } = req.body

    knex('user').where('username', username).orWhere('email', email).select('id_user').then(data => {
        // console.log(data)
        if (data.length === 0) {
            log.error('Not Found Username or Email in System')
            console.log('Not Found Username or Email in System')

            res.status(404).send({
                success: false,
                message: 'Incorrect Username,email or Password'
            })
        } else {
            knex('user').where('password', password).select('*').then(data1 => {
                // console.log(data1)
                if (data1.length === 0) {
                    log.error('Password Incorrect')
                    console.log('Password Incorrect')

                    res.status(404).send({
                        success: false,
                        message: 'Incorrect Username,email or Password'
                    })
                } else {
                    let idUser = data1[0].id_user
                    res.status(200).send({
                        success: true,
                        id: idUser,
                        username: data1[0].username,
                        name: data1[0].name
                    })
                }
            })
        }
    })
})

// TODO: Target sudah ada, tapi terkumpul belum dibuat
router.get('/user/return/:id_user', (req, res) => {
    var id_user = req.params.id_user
    knex('investment')
        .select()
        .where("id_user", id_user)
        .then(data => {
            var jumlah = 0
            data.map(function (index) {
                jumlah += index.total
            })
            knex('business')
                .select("valuasi")
                .where("id_business", data[0].id_business)
                .then(data2 => {
                    console.log(data2, jumlah)
                    knex('track_record')
                        .select("total")
                        .where("id_business", data[0].id_business)
                        .andWhere("month", 12)
                        .then(data3 => {
                            var tot = 0
                            if(data3){
                                tot = data3[0].total
                            }
                            var ret = jumlah / data2[0].valuasi * tot
                            res.status(200).send({
                                success: true,
                                return:ret
                            })
                        }).catch(err => {
                            log.error(err)
                            console.log(err)

                            res.status(503).send({
                                success: false
                            })
                        })
                }).catch(err => {
                    log.error(err)
                    console.log(err)

                    res.status(503).send({
                        success: false
                    })
                })
        }).catch(err => {
            log.error(err)
            console.log(err)

            res.status(503).send({
                success: false
            })
        })
})

// TODO: Buat created_at di database
router.post('/user/investment', (req, res) => {
    let { id_user, id_business, total } = req.body

    function updateTerkumpul() {
        knex('business').select('terkumpul').where('id_business', id_business).then(data1 => {
            // console.log(data1[0].terkumpul)

            let terkumpul = total + data1[0].terkumpul

            knex('business').where({ 'id_business': id_business }).update({ 'terkumpul': terkumpul })
        }).catch(err => {
            log.error(err)
            console.log(err)

            res.status(503).send({
                success: false
            })
        })
    }

    knex('investment').insert({ id_user, id_business, total }).then(data => {
        updateTerkumpul()

        res.status(200).send({
            success: true
        })
    }).catch(err => {
        log.error(err)
        console.log(err)

        res.status(503).send({
            success: false
        })
    })
})

router.post('/business/register', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var name = req.body.name
    var target = req.body.target
    var valuasi = req.body.valuasi
    var domisili = req.body.domisili
    var description = req.body.description
    var business_name = req.body.business_name
    var status = false

    knex.select("username", "email")
        .from("business")
        .where("username", username)
        .orWhere("email", email)
        .andWhere('status', false)
        .then(data => {
            if (data.length === 0) {
                knex('business')
                    .insert({ username, name, email, password, domisili, business_name, description, status, valuasi, target })
                    .then((newUserId) => {
                        knex('business').select().where('username', username).then(data => {

                            res.status(200).send({
                                success: true,
                                id: data[0].id_business,
                                name: data[0].name,
                                username: data[0].username
                            })
                        })
                    })
            } else {
                res.status(404).send({
                    success: false,
                    message: "EMAIL or USERNAME already taken !"
                })
            }
        })
})

router.post('/business/login', (req, res) => {
    var username = req.body.email
    var password = req.body.password

    knex("business")
        .where("username", username)
        .orWhere("email", username)
        .andWhere('status', false)
        .select("id_business", "username", "password")
        .then(data => {
            if (data[0].password == password) {
                console.log(data)
                res.send({
                    success: true,
                    id: data[0].id_business,
                    username: data[0].username,
                    name: data[0].name
                })
            } else {
                log.error('Incorrect username, email or password')
                console.log('gagal')
                res.status(404).send({
                    success: false,
                    message: 'Incorrect Username,email or Password'
                })
            }
        }).catch(err => {
            log.error('GAGAL LOGIN')
            res.status(404).send({
                success: false,
                message: 'Failed to connect to the server'
            })
        })
})

router.put('/business/profile/updateDescription/', (req, res) => {
    var business_name = req.body.business_name
    var domisili = req.body.domisili
    var description = req.body.description
    var id_business = req.body.id_business

    knex('business')
        .where("id_business", id_business)
        .update({ business_name, domisili, description })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            console.log(err)
            log.error(err)
            res.status(404).send({
                success: false
            })
        })
})

router.post('/business/profile/insertTarget', (req, res) => {
    var target = req.body.target
    var id_business = req.body.id_business

    knex('business')
        .where("id_business", id_business)
        .update({ target })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            res.status(404).send({
                success: false
            })
            console.log(err)
        })
})

router.post('/business/profile/addRecord', (req, res) => {
    var total = req.body.total
    var month = req.body.month
    var id_business = req.body.id_business
    var create_at = moment().tz('Indonesia').format("YYYY-MM-DD HH:mm:ss")
    var deleted = false

    console.log(create_at)
    knex('track_record')
        .insert({ id_business, month, create_at, total, deleted })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            console.log(err)
            log.error(err)
            res.status(404).send({
                success: false
            })
        })
})

router.put('/business/profile/updateRecord/', (req, res) => {
    var total = req.body.total
    var id_business = req.body.id_business
    var create_at = moment().tz('Indonesia').format("YYYY-MM-DD HH:mm:ss")
    var month = req.body.month

    knex('track_record')
        .where("month", month)
        .andWhere("id_business", id_business)
        .update({ month, create_at, total })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            res.status(404).send({
                success: false
            })
            console.log(err)
        })
})

router.post('/business/profile/addDocumentation', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(404).send({
            success: false,
            message: "File not found !"
        });
    }

    var id_business = req.body.id_business
    var file = req.files.photo
    var photo = Math.floor(Math.random() * 100000).toString() + ".png"
    var deleted = false

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        file.mv('uploads/documentations/' + photo, (err) => {
            if (err) {
                log.error(err)
                console.log(err)
                res.send({
                    success: false,
                    message: "File is empty !",
                    url: "https://igniter.herokuapp.com/uploads/documentations/" + photo
                })
            } else {
                knex('documentation')
                    .insert({ id_business, photo, deleted })
                    .then((data) => {
                        // console.log(data)
                        res.send({
                            status: true
                        })
                    }).catch(err => {
                        log.error(err)
                        console.log(err)
                        res.status(404).send({
                            status: false,
                            message: "Error request to the server"
                        })
                    })
            }
        })
    } else {
        res.status(404).send({
            status: false,
            message: "Incorrect file format !"
        })
    }
})

router.post('/business/profile/uploadHeader/:id_business', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({
            success: false,
            message: "File not found !"
        });
    }

    var id_business = req.params.id_business
    var file = req.files.img
    var photo = Math.floor(Math.random() * 100000).toString() + ".png"

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
                            status: true,
                            url: "https://igniter.herokuapp.com/uploads/documentations/" + photo
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
    } else {
        res.status(404).send({
            status: false,
            message: "Incorrect file format !"
        })
    }
})

router.post('/business/profile/uploadAttach', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({
            success: false,
            message: "File not found !"
        });
    }

    var id_business = req.body.id_business
    var file = req.files.attach
    var attach = file.name
    var deleted = false
    console.log(attach)

    file.mv('uploads/attachments/' + attach, (err) => {
        if (err) {
            res.send({
                success: false,
                msg: "FILE KOSONG"
            })
        } else {
            knex('attachment')
                .insert({ id_business: id_business, file: attach, deleted })
                .then((data) => {
                    console.log(data)
                    res.send({
                        status: true,
                        url: "https://igniter.herokuapp.com/uploads/attachments/" + attach
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

router.post('/business/profile/deleteRecord/:id_track', (req, res) => {
    var deleted = true
    var id_track = req.params.id_track

    knex('track_record')
        .where('id_track', id_track)
        .update({ deleted })
        .then((newData) => {
            res.send({
                success: true,
                data: newData
            })
        }).catch(err => {
            res.status(404).send({
                success: false
            })
            console.log(err)
        })
})

router.post('/business/profile/deleteAttach/:id_attachment', (req, res) => {
    var deleted = true
    var id_attachment = req.params.id_attachment

    knex('attachment')
        .where('id_attachment', id_attachment)
        .update({ deleted })
        .then((newData) => {
            res.send({
                success: true,
                data: newData
            })
        }).catch(err => {
            res.status(404).send({
                success: false
            })
            console.log(err)
        })
})

router.delete('/business/profile/deleteDoc/:id_documentation', (req, res) => {
    var deleted = true
    var id_documentation = req.params.id_documentation

    knex('documentation')
        .where('id_documentation', id_documentation)
        .update({ deleted })
        .then((newData) => {
            v
            res.send({
                success: true,
                data: newData
            })
        }).catch(err => {
            res.status(404).send({
                success: false
            })
            console.log(err)
        })
})

router.delete('/business/profile/deleteAttach/:id_attachment', (req, res) => {
    var id_attachment = req.params.id_attachment
    var deleted = true
    knex('attachment')
        .where("id_attachment", id_attachment)
        .update({ deleted })
        .then((newData) => {
            res.send({
                success: true,
                id: newData[0]
            })
        }).catch(err => {
            console.log(err)
            log.error(err)
            res.status(404).send({
                success: false
            })
        })
})

module.exports = router