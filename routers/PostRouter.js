const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')
const CheckLogin = require('../auth/CheckLogin')
const Post = require('../models/content/post/post.model')



Router.get('/' ,(req, res) => {
    Post.find()
    .then(post => {
        res.json({
            code: 0,
            message: 'Đọc danh sách sản phẩm thành công',
            data: post
        })
    })
})

Router.post('/', (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        
        const {type, content, user_id, attachments} = req.body
        let like_count = 0
        let comment_count = 0
        let created_at = new Date()
        let modified_at = new Date()
        let _userId = user_id
        let post = new Post({
            type, like_count, comment_count, created_at, modified_at, _userId, attachments,content
        })
        post.save()
        .then(() => {
            // return res.json({code: 0, message: 'Thêm post thành công',
            //     data: post})
            res.redirect("/")
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


Router.post('/home', (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        
        const {type, content, user_id, attachments} = req.body
        let like_count = 0
        let comment_count = 0
        let created_at = new Date()
        let modified_at = new Date()
        let _userId = user_id
        let post = new Post({
            type, like_count, comment_count, created_at, modified_at, _userId, attachments,content
        })
        post.save()
        .then(() => {
            // return res.json({code: 0, message: 'Thêm post thành công',
            //     data: post})
            res.redirect("/home")
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

Router.get('/:_userId',CheckLogin, (req, res) => {
    let {_userId} = req.params
    if(!_userId){
        return res.json({code: 1, message: 'Loi'})
    }
    Post.findById(_userId)
    .then(post => {
        // console.log(annou)
        // res.render('notification_list',{ layout: '../views/layouts/notification_layout', announ: announ})
        if(post)
        {
            res.render('GuestHome',{ layout: '../views/layouts/layout', post: post, auth:req.auth})
        }
        
    })
})

Router.delete('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin '})
    }
    Post.findByIdAndDelete(id)
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

    let supportedFields = ['type', 'post_content_id', 'like_count', 'comment_count', 'created_at', 'modified_at', 'author', 'attachments']

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


    
    Post.findByIdAndUpdate(id, updateData, {
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