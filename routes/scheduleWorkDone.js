const router = require("express").Router;
const { uplSubtaskValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')
const router = require("express").Router;

// POST /scheduleWorkDone
router.post('/', auth, errForward(async (req, res) => {
    const scheduleWorkDone = await prisma.scheduleWorkDone.create({
        data: {
            scheduleId: req.body.scheduleId,
            workId: req.body.workId,
            userId: req.locals.userId,
        },
        select: {
            id: true,
        }
    })

    if (!scheduleWorkDone) {
        return res.status(500).json({
            err: `Could not find streaks with schedule id: ${req.params.id}`
        })
    }

    return res.status(201).json({
        msg: `Successfully created scheduleWorkDone with id: ${scheduleWorkDone.id}`
    })
}))

// DELETE /scheduleWorkDone
router.delete('/', auth, uplSubtaskValidtn, errForward(async (req, res) => {
    const scheduleWorkDone = await prisma.scheduleWorkDone.delete({
        where: {
            scheduleId: req.body.scheduleId,
            workId: req.body.workId,
        },
        select: {
            id: true,
        }
    })

    if (!scheduleWorkDone) {
        return res.status(404).json({
            err: 'Could not fetch streaks'
        })
    }

    return res.status(200).json({
        msg: `Successfully deleted scheduleWorkDone with id: ${scheduleWorkDone.id}`
    })
}))

module.exports = router
