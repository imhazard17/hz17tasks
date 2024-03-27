const router = require("express").Router;
const upload = require('../middleware/multer')
const { scheduleValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')
const router = require("express").Router;

// GET /user/share-my-schedule/:scheduleId
router.get('/share-my-schedule/:scheduleId', auth, errForward(async (req, res) => {
    const scheduleIdJwt = jwt.sign(req.params.scheduleId, process.env.SHARE_JWT_SECRET)
    return res.status(200).json(scheduleIdJwt)
}))

// GET /user/shared-schedule/:scheduleIdJwt
router.get('/shared-schedule/:scheduleIdJwt', auth, errForward(async (req, res) => {
    const scheduleId = jwt.verify(req.params.scheduleIdJwt, process.env.SHARE_JWT_SECRET)

    const schedule = await prisma.schedule.findUnique({
        where: {
            id: scheduleId,
        },
        include: {
            works: true,
            task: {
                title: true,
                desc: true,
            }
        }
    })

    if (!schedule) {
        return res.status(404).json({
            err: 'Error getting schedule details'
        })
    }

    delete schedule.taskId
    return res.status(200).json(schedule)
}))

// GET /schedule/id/:id
router.get('/id/:id', auth, errForward(async (req, res) => {
    const schedule = await prisma.schedule.findUnique({
        where: {
            id: req.params.id,
        }
    })

    if (!schedule) {
        return res.status(500).json({
            err: `Could not find schedule with id: ${req.params.id}`
        })
    }

    return res.status(200).json(schedule)
}))

// GET /schedule/all?sortBy=(startDate, endDate, gap) ?highestPriority=(true,false)
router.get('/all', auth, errForward(async (req, res) => {
    // ==VISIT==
}))

// POST /schedule/new
router.post('/new', auth, scheduleValidtn, errForward(async (req, res) => {
    const createdSchedule = await prisma.schedule.create({
        data: req.body.schedule,
        select: {
            id: true
        },
    })

    if (!createdSchedule) {
        return res.status(404).json({
            err: 'Could not create schedule'
        })
    }

    return res.status(201).json({
        msg: `successfully created schedule with id: ${createdSchedule.id}`,
        authToken: token
    })
}))

// PUT /schedule/update/:id
router.put('/update/:id', auth, scheduleValidtn, errForward(async (req, res) => {
    const updatedSchedule = await prisma.schedule.update({
        data: req.body.schedule,
        select: {
            id: true
        },
    })

    if (!updatedSchedule) {
        return res.status(404).json({
            err: 'Could not update schedule'
        })
    }

    return res.status(201).json({
        msg: `successfully dudated schedule with id: ${updatedSchedule.id}`,
    })
}))

// DELETE /schedule/delete/:id
router.delete('/delete/:id', auth, errForward(async (req, res) => {
    const deletedSchedule = await prisma.schedule.delete({
        where: {
            id: req.params.id,
        },
        select: {
            id: true
        }
    })

    if (!deletedSchedule) {
        return res.status(500).json({
            err: `Could not delete schedule with id: ${req.params.id}`
        })
    }

    return res.status(200).json({
        msg: `Successfully deleted schedule with id: ${deletedSchedule.id}`
    })
}))

module.exports = router
