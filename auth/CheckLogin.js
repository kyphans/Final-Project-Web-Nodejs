const jwt = require('jsonwebtoken')
const CookieParser = require('cookie-parser')
const express = require('express')
const app = express()
app.use(CookieParser())
const Account = require('../models/user.model')

module.exports = (req, res, next) => {
    const { JWT_SECRET } = process.env
    let token = req.cookies.token
    let agg = [
        {
          '$lookup': {
            'from': 'departments', 
            'localField': '_departmentId', 
            'foreignField': '_id', 
            'as': 'department'
          }
        }, {
          '$unwind': {
            'path': '$department'
          }
        }, {
          '$project': {
            'department.createdAt': 0, 
            'department.updatedAt': 0, 
            'department.__v': 0
          }
        }
    ]

    if (!token) {
        return res.status(401)
            .json({ code: 101, message: "Vui long cung cap token hop le" })
    }

    jwt.verify(token, JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401)
                .json({ code: 101, message: "Token khong hop le hoac da het han" })
            // return res.redirect('/login');
        } else {
            Account.findOne({
                email: data.email
            })
            .then((acc) => {
                req.auth = acc
                // console.log(acc)
                next()
            })
            .catch((err)=>{
                console.log("Lỗi")
            })
        }
    })
}