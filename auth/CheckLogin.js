const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    let authorization = req.header('Authorization')
    if (!authorization){
        return res.status(401)
        .json({code: 101, message: "Vui long cung cap token qua header"})
    }
    let token = authorization.split(' ')[1]
    if(!token) {
        return res.status(401)
        .json({code: 101, message: "Vui long cung cap token hop le"})
    }
    // const {token} = req.body
    const {JWT_SECRET} = process.env

    jwt.verify(token, JWT_SECRET, (err, data) => {
        if(err){
            return res.status(401)
            .json({code: 101, message: "Token khong hop le hoac da het han"})
        }
        req.user = data
        next()
    })
}