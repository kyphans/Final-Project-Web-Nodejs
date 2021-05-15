const Annoucement = require('../models/content/annoucement/annoucement.model')
const Department = require('../models/department.model')
const Categories = require('../models/categories.model')
const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')
const CheckLogin = require('../auth/CheckLogin')


Router.get('/',CheckLogin,(req,res) => {
    // res.render('notification_list',{ layout: '../views/layouts/notification_layout' })
    let agg = [
        {
            '$sort': {
              'created_at': -1
            }
        }  
    ]
    Annoucement.aggregate(agg)
    .then(announ => {
        // console.log(annou)
        res.render('notification_list',{ layout: '../views/layouts/notification_layout', announ: announ, auth:req.auth})
    })
})

Router.get('/create', (req, res) => {
    Annoucement.find()
    .then(announ => {
        Categories.find()
        .then(cate => {
            res.render('create_annou.ejs',{ layout: './layouts/layout', announ: announ, cate: cate, auth:req.auth})
        })
    })
    
    
})

Router.post('/', (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {type, title, user_id, attachments, content, categories_id} = req.body
        let created_at = new Date()
        let modified_at = new Date()
        console.log(created_at)
        let annoucement = new Annoucement({
            type, title, created_at, modified_at, user_id, attachments, content, categories_id
        })

        annoucement.save()
        .then(() => {
            // return res.json({code: 0, message: 'Thêm post thành công',
            //     data: annoucement})
            res.redirect("/announ")
        })
        .catch(e => {
            return res.json({code: 2, message: e.message})
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

Router.get('/:id',CheckLogin, (req, res) => {
    let {id} = req.params
    if(!id){
        return res.json({code: 1, message: 'Loi'})
    }
    Annoucement.findById(id)
    .then(announ => {
        // console.log(annou)
        // res.render('notification_list',{ layout: '../views/layouts/notification_layout', announ: announ})
        if(announ)
        {
            res.render('noti_detail',{ layout: '../views/layouts/detail_noti_layout', announ: announ, auth:req.auth})
        }
        
    })
})


Router.delete('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin '})
    }
    Annoucement.findByIdAndDelete(id)
    .then(p =>
        {
            if(p)
            {
                return res.json({code: 0, message: 'Da xoa bai Post san pham'})
            }else
                return res.json({code: 2, message: 'Khong xoa duoc bai Post'})
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

Router.put('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin '})
    }

    let supportedFields = ['type', 'title', 'created_at', 'modified_at', 'author', 'attachments']

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


    
    Annoucement.findByIdAndUpdate(id, updateData, {
        new: true
    })
    .then(p =>
        {
            if(p)
            {
                return res.json({code: 0, message: 'Da cap nhat thanh cong', data: p})
            }else
                return res.json({code: 2, message: 'Cap nhat khong thanh cong'})
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

module.exports = Router