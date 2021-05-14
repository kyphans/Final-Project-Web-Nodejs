const { json } = require('express')
const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const app = express()
const multer= require('multer')
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const morgan = require('morgan');

const mongoose = require('mongoose')
const cors = require('cors')
const uploadModel = require('./models/image_model')
const Account = require('./models/user.model')
const AccountRouter = require('./routers/AccountRouter')
const Post = require('./routers/PostRouter')
const AnnouncementRouter = require('./routers/AnnouncementRouter')
const CategoriesRouter = require('./routers/CategoriesRouter')
const CommentRouter = require('./routers/CommentRouter')
const DepartmentRouter = require('./routers/DepartmentRouter')
const CookieParser = require('cookie-parser')
const Annoucement = require('./models/content/annoucement/annoucement.model')

require('dotenv').config()

const PORT = process.env.PORT
app.set("view engine", "ejs")
app.use(expressLayouts);
app.set('layout','./layouts/layout')


app.use((req,res,next) => {
    req.vars = {root: __dirname}
    next()
})
app.use(CookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

const CheckLogin = require('./auth/CheckLogin')

//static file
app.use(express.static('public'))
app.use(fileUpload({
    createParentPath: true
}));
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

app.get('/',CheckLogin,(req,res) => {
    Annoucement.find()
    .then(announ => {
        // console.log(annou)
        // res.render('notification_list',{ layout: '../views/layouts/notification_layout', announ: announ})
        res.render('index', {announ: announ, auth:req.auth})
    })
   
})

app.get('/login',(req,res) => {
    res.render('login',{ layout: './layouts/layout_login'})
})


app.post('/edit-info', async (req, res) => {
    try {
        if(!req.files.filename) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.filename;
            let email = req.cookies.email
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

app.get('/edit-info',CheckLogin,(req,res, next) => {
    
    Annoucement.find()
    .then(announ => {
        // console.log(annou)
        // res.render('notification_list',{ layout: '../views/layouts/notification_layout', announ: announ})
        
        
        res.render('edit-info', {announ: announ, auth:req.auth})
    })
})



app.use('/account', AccountRouter)
app.use('/post',CheckLogin, Post)
app.use('/announ',CheckLogin, AnnouncementRouter)
app.use('/cate',CheckLogin, CategoriesRouter)
app.use('/comment',CheckLogin, CommentRouter)
app.use('/department',CheckLogin, DepartmentRouter)


app.all('*', (req, res) => res.json({code:101, message: 'Đường dẫn hoặc phương thức không được hỗ trợ'}))

// app.listen(PORT, () => console.log("listening on port: http://localhost:" + PORT))
mongoose.connect('mongodb://localhost:27017/Social', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    // chỉ start server sau khi đã connect đến db
    app.listen(PORT, () => {
        console.log('http://localhost:' + PORT)
    })
})
.catch(e => console.log('Không thể kết nối tới db server: ' + e.message))