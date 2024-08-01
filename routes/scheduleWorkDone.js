const router = require("express").Router();
const { uplSubtaskValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')

// GET /scheduleWorkDone/:scheduleId
router.get('/', auth, errForward(async (req, res) => {
    const scheduleWorkDones = await prisma.scheduleWorkDone.findMany({
        where: {
            scheduleId: req.params.scheduleId,
        }
    })

    if (!scheduleWorkDones) {
        return res.status(500).json({
            err: `Could not find scheduleWorkDones with schedule id: ${req.params.scheduleId}`
        })
    }

    return res.status(201).json({
        msg: `Successfully created scheduleWorkDone with id: ${scheduleWorkDones.id}`
    })
}))

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
            err: 'Could not create scheduleWorkDone'
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
        return res.status(500).json({
            err: 'Could not delete scheduleWorkDone'
        })
    }

    return res.status(200).json({
        msg: `Successfully deleted scheduleWorkDone with id: ${scheduleWorkDone.id}`
    })
}))

module.exports = router
