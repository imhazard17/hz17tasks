const router = require("express").Router;
const upload = require('../middleware/multer')
const { uplUserValidtn, userValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const bcrypt = require('bcrypt')
const auth = require('../middleware/authentication')

// POST /auth/signup
router.post('/signup', auth, uplUserValidtn, upload.single('file'), errForward(async (req, res) => {
    const createdUser = await prisma.user.create({
        data: {
            username: req.headers.username,
            password: bcrypt.hashSync(req.headers.password, 10),
            firstName: req.headers.firstName,
            lastName: req.headers.lastName,
            dpUrl: req.file?.path,
        },
        select: {
            id: true
        },
    })

    if (!createdUser) {
        return res.status(500).json({
            err: 'Could not create account'
        })
    }

    const token = jwt.sign(createdUser.id, process.env.JWT_SECRET)

    return res.status(201).json({
        msg: `successfully created account with username: ${req.headers.username}`,
        authToken: token
    })
}))

// GET /auth/login
router.get('/login', auth, userValidtn, errForward(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        },
        select: {
            id: true,
            username: true,
            password: true
        }
    })

    if (!user) {
        return res.status(500).json({
            err: 'Username or password incorrect'
        })
    }

    if (bcrypt.compareSync(req.body.password, user.password) === false) {
        return res.status(404).json({
            err: 'Username or password incorrect'
        })
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET)

    return res.status(200).json({
        msg: `successfully logged into account with username: ${user.username}`,
        authToken: token
    })
}))

module.exports = router
