const express = require('express')
// const axios = require('axios')
const Router = express.Router()
const {validationResult} = require('express-validator')
const CheckLogin = require('../auth/CheckLogin')
const Department = require('../models/department.model')
const Annoucement = require('../models/content/annoucement/annoucement.model')



Router.get('/',(req, res) => {
    let agg_annou = [
        {
            '$sort': {
                'created_at': -1
            }
        } 
    ]

    Annoucement.aggregate(agg_annou)
    .then(announ => {
        Department.find()
        .then(department => {
            // console.log(department)
            console.log(req.auth)
            res.render('department.ejs',{ layout: './layouts/layout', department: department, announ: announ, auth:req.auth})
        })
    })
})

Router.post('/', (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {name} = req.body
        let department = new Department({
            name
        })
        department.save()
        .then(() => {
            return res.json({code: 0, message: 'Thêm post thành công',
                data: department})
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

Router.get('/:id',(req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin'})
    }
    Categories.findById(id)
    .then(p =>
        {
            if(p)
            {
                return res.json({code: 0, message: 'Da tim thay department', data: p})
            }else
                return res.json({code: 2, message: 'Khong tim thay department'})
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

Router.delete('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin '})
    }
    Department.findByIdAndDelete(id)
    .then(p =>
        {
            if(p)
            {
                return res.location('/department')
            }else
                return res.json({code: 2, message: 'Khong xoa duoc '})
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

Router.put('/:id', (req, res) => {
    let {id} = req.params
    if(!id)
    {
        return res.json({code: 1, message: 'Khong co thong tin '})
    }

    let supportedFields = ['name']

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


    
    Department.findByIdAndUpdate(id, updateData, {
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