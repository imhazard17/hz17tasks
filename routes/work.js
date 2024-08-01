const router = require("express").Router();
const { workValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')

// GET /work/id/:id
router.get('/id/:id', auth, errForward(async (req, res) => {
    const work = await prisma.work.findUnique({
        where: {
            id: req.params.id,
        }
    })

    if (!work) {
        return res.status(500).json({
            err: `Could not find work with id: ${req.params.id}`
        })
    }

    return res.status(200).json(work)
}))

// POST /work/new
router.post('/new', auth, workValidtn, errForward(async (req, res) => {
    const createdWork = await prisma.work.create({
        data: req.body.work,
        select: {
            id: true
        },
    })

    if (!createdWork) {
        return res.status(404).json({
            err: 'Could not create work'
        })
    }

    return res.status(201).json({
        msg: `successfully created work with id: ${createdWork.id}`,
        authToken: token
    })
}))


// PUT /work/update/:id
router.put('/update/:id', auth, workValidtn, errForward(async (req, res) => {
    const updatedWork = await prisma.work.update({
        data: req.body.work,
        select: {
            id: true
        },
    })

    if (!updatedWork) {
        return res.status(404).json({
            err: 'Could not update work'
        })
    }

    return res.status(201).json({
        msg: `successfully dudated work with id: ${updatedWork.id}`,
    })
}))


// DELETE /work/delete/:id
router.delete('/delete/:id', auth, errForward(async (req, res) => {
    const deletedWork = await prisma.work.delete({
        where: {
            id: req.params.id,
        },
        select: {
            id: true
        }
    })

    if (!deletedWork) {
        return res.status(500).json({
            err: `Could not delete work with id: ${req.params.id}`
        })
    }

    return res.status(200).json({
        msg: `Successfully deleted work with id: ${deletedWork.id}`
    })
}))

module.exports = router
