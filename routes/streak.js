const router = require("express").Router;
const { uplSubtaskValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')
const router = require("express").Router;

// GET /streak/schedule/:scheduleId
router.get('/schedule/:scheduleId', auth, errForward(async (req, res) => {
    const streaks = await prisma.streak.findMany({
        where: {
            scheduleId: req.params.scheduleId,
        }
    })

    if (!streaks) {
        return res.status(500).json({
            err: `Could not find streaks with schedule id: ${req.params.id}`
        })
    }

    return res.status(200).json(streaks)
}))

// GET /streak/my-streaks
router.get('/my-streaks', auth, uplSubtaskValidtn, errForward(async (req, res) => {
    const streaks = await prisma.streak.findMany({
        where: {
            userId: req.locals.userId
        },
    })

    if (!streaks) {
        return res.status(404).json({
            err: 'Could not fetch streaks'
        })
    }

    return res.status(200).json(streaks)
}))

// GET /streak/current-streaks/:id
router.get('/current-streaks/:id', auth, errForward(async (req, res) => {
    const streaks = await prisma.streak.findMany({
        where: {
            userId: req.locals.userId,
            endDate: null,
        },
    })

    if (!streaks) {
        return res.status(500).json({
            err: 'Could not fetch streaks'
        })
    }

    return res.status(200).json(streaks)
}))

// POST /streak/new ==> created by db cron
// DELETE /streak/delete ==> deleted by db cron

module.exports = router
