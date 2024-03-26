const router = require("express").Router;
const upload = require('../middleware/multer')
const { uplTaskValidtn, taskValidtn } = require('../middleware/input_validation')
const errForward = require('../utils/errorForward')
const prisma = require('../utils/db')
const auth = require('../middleware/authentication')
const router = require("express").Router;
const fs = require('node:fs/promises')

// GET /task/id/:id
router.get('/id/:id', auth, errForward(async (req, res) => {
    const task = await prisma.task.findUnique({
        where: {
            id: req.params.id,
        }
    })

    if (!task) {
        return res.status(500).json({
            err: `Could not find task with id: ${req.params.id}`
        })
    }

    return res.status(200).json(task)
}))

// GET /task/archived
router.get('/archived', auth, errForward(async (req, res) => {
    const tasks = await prisma.task.findUnique({
        where: {
            archive: true,
        }
    })

    if (!tasks) {
        return res.status(500).json({
            err: `Could not find task with id: ${req.params.id}`
        })
    }

    return res.status(200).json(tasks)
}))

// GET /task/all (query=> sort by priority, deadline, group=> label, priority, cat, sub cat, tag, bookmark, completed)
router.get('/id/:id', auth, errForward(async (req, res) => {
    // ==VISIT==
}))

// GET /task/search/?name_desc= (full text search)
router.get('/search', auth, errForward(async (req, res) => {
    const tasks = await prisma.task.findUnique({
        where: {
            OR: [
                {
                    name: {
                        search: req.query.name_desc,
                    },
                },
                {
                    desc: {
                        search: req.query.name_desc,
                    }
                },
                {
                    subtasks: {
                        some: {
                            OR: [
                                {
                                    name: {
                                        search: req.query.name_desc,
                                    },
                                },
                                {
                                    desc: {
                                        search: req.query.name_desc,
                                    }
                                },
                            ]
                        }
                    }
                }
            ],
        }
    })

    if (!tasks) {
        return res.status(404).json({
            err: 'No such task found'
        })
    }

    return res.status(200).json(tasks)
}))

// POST /task/new
router.post('/new', auth, uplTaskValidtn, upload.array('file', 5), errForward(async (req, res) => {
    const createdTask = await prisma.task.create({
        data: {
            desc: req.headers.desc,
            category: req.headers.category,
            subCategory: req.headers.subCategory,
            priority: req.headers.priority,
            tags: req.headers.tags,
            bookmark: req.headers.bookmark,
            completed: req.headers.completed,
            archive: req.headers.archive,
            deadline: req.headers.deadline,
            attactments: req.files?.map(file => file.path),
            createdAt: req.headers.createdAt,
            updatedAt: req.headers.updatedAt,
        },
        select: {
            id: true
        },
    })

    if (!createdTask) {
        return res.status(404).json({
            err: 'Could not create task'
        })
    }

    return res.status(201).json({
        msg: `successfully created task with id: ${createdTask.id}`,
        authToken: token
    })
}))

// PUT /task/update/:id
router.put('/update/:id', auth, uplTaskValidtn, upload.array('file', 5), errForward(async (req, res) => {
    const task = await prisma.task.findUnique({
        where: {
            id: req.params.id,
        },
        select: {
            attactments: true,
        }
    })

    const updatedTask = await prisma.task.update({
        data: {
            desc: req.headers.desc,
            category: req.headers.category,
            subCategory: req.headers.subCategory,
            priority: req.headers.priority,
            tags: req.headers.tags,
            bookmark: req.headers.bookmark,
            completed: req.headers.completed,
            archive: req.headers.archive,
            deadline: req.headers.deadline,
            attactments: req.files?.map(file => file.path),
            createdAt: req.headers.createdAt,
            updatedAt: req.headers.updatedAt,
        },
        select: {
            id: true
        },
    })

    if (!updatedTask) {
        return res.status(404).json({
            err: 'Could not update task'
        })
    }

    if (task.attachments) {
        for (let attachment of task.attachments) {
            await fs.unlink(attachment)
        }
    }

    return res.status(201).json({
        msg: `successfully created task with id: ${updatedTask.id}`,
    })
}))

// DELETE /task/delete/:id
router.delete('/delete/:id', auth, errForward(async (req, res) => {
    const task = await prisma.task.delete({
        where: {
            id: req.params.id,
        },
        select: {
            id: true
        }
    })

    if (!task) {
        return res.status(500).json({
            err: `Could not delete task with id: ${req.params.id}`
        })
    }

    return res.status(200).json({
        msg: `Successfully deleted task with id: ${task.id}`
    })
}))

module.exports = router
