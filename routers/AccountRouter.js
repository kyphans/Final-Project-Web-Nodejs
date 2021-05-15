const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Account = require('../models/user.model')
const Annoucement = require('../models/content/annoucement/annoucement.model')
const Department = require('../models/department.model')
const registerValidator = require('./validators/registerValidator')
const loginValidator = require('./validators/loginValidator')
const CheckLogin = require('../auth/CheckLogin')
const CookieParser = require('cookie-parser')
const fs = require('fs')
const multer= require('multer')
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const morgan = require('morgan');


Router.use(CookieParser())
Router.use(fileUpload({
    createParentPath: true
}));


Router.get('/',CheckLogin, (req, res) => {
    let agg = [
        {
            '$sort': {
              'role': 1
            }
        },
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
    Account.aggregate(agg)
    .then(users => {
        Annoucement.find()
        .then(announ => {
            Department.find()
            .then(department => {
                // console.log(department)
                res.render('users',{ layout: './layouts/layout', announ: announ, department: department, users:users, auth:req.auth})
            })
            .then(edit => {
                res.render('edit-info',{ layout: './layouts/layout', edit: edit, announ: announ, department: department, users:users, auth:req.auth})
            })
            
        })
    })
    
    
})

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        let {email, password} = req.body 
        let account = undefined

        Account.findOne({email: email})
        .then(acc => {
            if (!acc) {
                throw new Error('Email không tồn tại')
            }
            account = acc
            return bcrypt.compare(password, acc.password)
        })
        .then(passwordMatch => {
            if (!passwordMatch) {
                return res.status(401).json({code: 3, message: 'Đăng nhập thất bại, mật khẩu không chính xác'})
            }
            const {JWT_SECRET} = process.env
            jwt.sign({
                email: account.email,
                name: account.name
            },JWT_SECRET, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) throw err
                req.token = token
                return res.json({
                    code: 0,
                    message:'Đăng nhập thành công',
                    token: token,
                    email: account.email
                })
            })
        })
        .catch(e => {
            return res.status(401).json({code: 2, message: 'Đăng nhập thất bại: ' + e.message})
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {

        let {type, role, department_id, username, password,email, name, faculty_id, class_name, profile_picture, categories} = req.body
        Account.findOne({email: email})
        .then(acc => {
            if (acc) {
                throw new Error('Tài khoản này đã tồn tại (email)')
            }
        })
        .then(() => bcrypt.hash(password, 10))
        .then(hashed => {
            let user = new Account({
                type : type,
                role : role,
                _departmentId : department_id,
                email: email,
                username: username,
                password: hashed,
                name: name,
                faculty_id: faculty_id,
                class_name: class_name,
                categories: categories
            })
            user.save();
            const {root} = req.vars
            const userDir = `${root}/users-list/${user.email}`
            fs.mkdir(userDir, ()=>{
                return res.json({code: 0, message: 'Đăng ký tài khoản thành công', data: user})
            })
        })
        .catch(e => {
            return res.json({code: 2, message: 'Đăng ký tài khoản thất bại: ' + 
                                e.message})
        })
        
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})


Router.put('/:id', (req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin '})
    }

    let supportedFields = ['name','role','email','username','_departmentId']

    let updateData = req.body

    if(!updateData)
    {
        return res.json({code: 2, message: 'Khong co du lieu can cap nhat'})
    }



    for(field in updateData)
    {
        if(!supportedFields.includes(field))
        {
            delete updateData[field]
        }
    }

    // return res.json({code: 0, message: 'Test thu'})
    
    Account.findByIdAndUpdate(id, updateData, {
        new: true
    })
    .then(p =>
        {
            if(p)
            {
                return res.json({code: 0, message: 'Da cap nhat thanh cong', data: updateData})
            }else
                return res.json({code: 2, message: 'Cap nhat khong thanh cong'})
        })
    .catch(e =>
        {
            if(e.message.includes('Cast to ObjectId failed'))
            {
                return res.json({code: 3, message: 'Day khong phai la mot id hop le'})
            }
                return res.json({code: 3, message: e.message})
        })
})

Router.delete('/:id', (req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin ma san pham'})
    }
    Account.findOneAndDelete(id)
    .then(p =>
        {
            if(p)
            {
                return res.location('/account')
            }else
                return res.json({code: 2, message: 'Khong xoa duoc san pham'})
        })
    .catch(e =>
        {
            if(e.message.includes('Cast to ObjectId failed'))
            {
                return ress.json({code: 3, message: 'Day khong phai la mot id hop le'})
            }
                return ress.json({code: 3, message: e.message})
        })
})



Router.post('/edit-info', async (req, res) => {
    try {
        if(!req.files.filename) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.filename;
            let email = req.auth.email
                avatar.mv(`./users-list/${email}/` + avatar.name);
                console.log(email);
                  
            return res.json({
                status: true,
                message: 'File is uploaded',
                data: {
                    
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


Router.get('/edit-info',CheckLogin,(req,res) => {
    Annoucement.find()
    .then(announ => {
        // console.log(annou)
        // res.render('notification_list',{ layout: '../views/layouts/notification_layout', announ: announ})
        res.render('edit-info', {announ: announ, auth:req.auth})
    })
   
})


module.exports = Router