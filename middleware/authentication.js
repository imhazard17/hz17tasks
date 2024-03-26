const jwt = require('jsonwebtoken')

function authentication(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(411).json({
            err: 'Could not find auth token'
        })
    }

    const authToken = req.headers.authorization.split(' ')[1]
    
    try {
        const jwtVerifyRes = jwt.verify(authToken, process.env.JWT_SECRET)
        req.locals = {}
        req.locals.userId = parseInt(jwtVerifyRes)
        next()
    } catch(e) {
        return res.status(403).json({
            err: 'Could not authenticate user'
        })
    }
}

module.exports = authentication
