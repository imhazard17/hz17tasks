const router = require("express").Router;
const upload = require('../middleware/multer')
const { uplSubtaskValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')
const router = require("express").Router;
const fs = require('node:fs/promises')

// GET /subtask/id/:id
router.get('/id/:id', auth, errForward(async (req, res) => {
    const subtask = await prisma.subtask.findUnique({
        where: {
            id: req.params.id,
        }
    })

    if (!subtask) {
        return res.status(500).json({
            err: `Could not find subtask with id: ${req.params.id}`
        })
    }

    return res.status(200).json(subtask)
}))

// GET /subtask/all (query=> sort by priority, deadline, group=> task, label, priority, cat, sub cat, tag, bookmark, completed)
router.get('/id/all', auth, errForward(async (req, res) => {
    // ==VISIT==
}))

// POST /subtask/new/:taskId
router.post('/new', auth, uplSubtaskValidtn, upload.array('file', 3), errForward(async (req, res) => {
    const createdSubtask = await prisma.subtask.create({
        data: {
            desc: req.headers.desc,
            taskId: req.headers.taskId,
            tags: req.headers.tags,
            completed: req.headers.completed,
            deadline: req.headers.deadline,
            attactments: req.files?.map(file => file.path),
            createdAt: req.headers.createdAt,
            updatedAt: req.headers.updatedAt,
        },
        select: {
            id: true
        },
    })

    if (!createdSubtask) {
        return res.status(404).json({
            err: 'Could not create subtask'
        })
    }

    return res.status(201).json({
        msg: `successfully created subtask with id: ${createdSubtask.id}`,
    })
}))

// PUT /subtask/update/:id
router.put('/update/:id', auth, uplSubtaskValidtn, upload.array('file', 3), errForward(async (req, res) => {
    const subtask = await prisma.subtask.findUnique({
        where: {
            id: req.params.id,
        },
        select: {
            attactments: true,
        }
    })

    const updatedSubtask = await prisma.subtask.update({
        data: {
            desc: req.headers.desc,
            tags: req.headers.tags,
            taskId: req.headers.taskId,
            completed: req.headers.completed,
            deadline: req.headers.deadline,
            attactments: req.files?.map(file => file.path),
            createdAt: req.headers.createdAt,
            updatedAt: req.headers.updatedAt,
        },
        select: {
            id: true
        },
    })

    if (!updatedSubtask) {
        return res.status(404).json({
            err: 'Could not update subtask'
        })
    }

    if (subtask.attachments) {
        for (let attachment of subtask.attachments) {
            await fs.unlink(attachment)
        }
    }

    return res.status(201).json({
        msg: `successfully created subtask with id: ${updatedSubtask.id}`,
    })
}))

// DELETE /subtask/delete/:id
router.delete('/delete/:id', auth, errForward(async (req, res) => {
    const deletedSubtask = await prisma.subtask.delete({
        where: {
            id: req.params.id,
        },
        select: {
            id: true
        }
    })

    if (!deletedSubtask) {
        return res.status(500).json({
            err: `Could not delete subtask with id: ${req.params.id}`
        })
    }

    return res.status(200).json({
        msg: `Successfully deleted subtask with id: ${deletedSubtask.id}`
    })
}))

module.exports = router
