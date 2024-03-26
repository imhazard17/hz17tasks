const router = require("express").Router;
const upload = require('../middleware/multer')
const { uplUserValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')
const router = require("express").Router;
const fs = require('node:fs/promises')
const jwt = require('jsonwebtoken')

// GET /user/share-profile
router.get('/:userIdJwt', auth, errForward(async (req, res) => {
    const userIdJwt = jwt.sign(req.locals.userId, process.env.SHARE_JWT_SECRET)
    return res.status(200).json(userIdJwt)
}))

// GET /user/share/:userIdJwt
router.get('/:userIdJwt', auth, errForward(async (req, res) => {
    const userId = jwt.verify(req.params.userIdJwt, process.env.SHARE_JWT_SECRET)

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            tasks: {
                some: {
                    archived: true
                }
            },
            schedules: true,
            _count: {
                select: {
                    tasks: {
                        some: {
                            archived: true
                        }
                    },
                }
            }
        }
    })

    if (!user) {
        return res.status(404).json({
            err: 'Error getting user details'
        })
    }

    delete user.password
    return res.status(200).json(user)
}))

// GET /user/my-details
router.get('/my-details', auth, errForward(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.locals.userId,
        },
        include: {
            tasks: true,
            schedules: true,
            _count: {
                select: {
                    tasks: true,
                    schedules: true
                }
            }
        }
    })

    if (!user) {
        return res.status(404).json({
            err: 'Error getting user details'
        })
    }

    delete user.password
    return res.status(200).json(user)
}))

// PUT /user/change-details
router.put('/change-details', auth, uplUserValidtn, upload.single('file'), errForward(async (req, res) => {
    const userId = req.locals.userId

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            dpUrl: true,
        }
    })

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            username: req.headers.username,
            bio: req.headers.bio,
            password: req.headers.password,
            firstName: req.headers.firstName,
            lastName: req.headers.lastName,
            doj: req.headers.doj,
            dpUrl: req.file?.path,
        }
    })

    if (!updatedUser) {
        return res.status(404).json({
            err: 'Could not update user details'
        })
    }

    if(user) {
        fs.unlink(user.dpUrl)
    }

    delete updatedUser.password
    return res.status(200).json(updatedUser)
}))

// DELETE /user/delete-account
router.delete('/delete-account', auth, errForward(async (req, res) => {
    const user = await prisma.user.delete({
        where: {
            id: req.locals.userId,
        },
        select: {
            id: true,
        }
    })

    if (!user) {
        return res.status(404).json({
            err: 'Error deleting user'
        })
    }

    return res.status(200).json({
        err: 'User deleted successfully'
    })
}))

module.exports = router
