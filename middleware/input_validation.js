const z = require('zod')

const passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,40}$";

const userSchema = z.object({
    username: z.string().min(5).max(30),
    password: z.string().min(8).max(40).regex(passRegex),
    firstName: z.string().max(30).optional(),
    lastName: z.string().max(30).optional(),
    bio: z.string().max(500).optional(),
})

const taskSchema = z.object({
    userId: z.number(),
    title: z.string().min(3).max(100),
    desc: z.string().max(500).optional(),
    category: z.string().max(50).optional(),
    subCategory: z.string().max(50).optional(),
    priority: z.enum(["HIGHEST", "HIGH", "MEDIUM", "LOW", "NO"]),
    tags: z.array(z.string().max(50).optional()),
    bookmark: z.boolean(),
    completed: z.boolean(),
    archive: z.boolean(),
    deadline: z.date().optional(),
})

const subtaskSchema = z.object({
    taskId: z.number(),
    title: z.string().min(3).max(100),
    desc: z.string().max(500).optional(),
    tags: z.array(z.string().max(50).optional()),
    completed: z.boolean(),
    deadline: z.date().optional(),
})

const scheduleSchema = z.object({
    userId: z.number().min(1),
    name: z.string().min(3).max(100),
    desc: z.string().max(500).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    highestPriority: z.boolean(),
})

const workSchema = z.object({
    name: z.string().min(3).max(100),
    desc: z.string().max(500).optional(),
    scheduleId: z.number(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
})

function userValidtn(req, res, next) {
    try {
        userSchema.parse(req.body)
        next()
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    }
}

function uplUserValidtn(req, res, next) {
    try {
        userSchema.parse({
            username: req.headers.username,
            password: req.headers.password,
            firstName: req.headers.firstName,
            lastName: req.headers.lastName,
            bio: req.headers.bio,
        })
        next()
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    }
}

function scheduleValidtn(req, res, next) {
    try {
        scheduleSchema.parse(req.body)
        next()
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    }
}

function uplSubtaskValidtn(req, res, next) {
    try {
        subtaskSchema.parse({
            desc: req.headers.desc,
            title: req.headers.title,
            tags: req.headers.tags,
            taskId: req.headers.taskId,
            completed: req.headers.completed,
            deadline: req.headers.deadline,
        })
        next()
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    }
}

function taskValidtn(req, res, next) {
    try {
        taskSchema.parse(req.body)
        next()
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    }
}

function uplTaskValidtn(req, res, next) {
    try {
        taskSchema.parse({
            desc: req.headers.desc,
            title: req.headers.title,
            tags: req.headers.tags,
            taskId: req.headers.taskId,
            completed: req.headers.completed,
            deadline: req.headers.deadline,
            category: req.headers.category,
            subCategory: req.headers.subCategory,
            priority: req.headers.priority,
            bookmark: req.headers.bookmark,
            archive: req.headers.archive,
        })
        next()
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    }
}

function workValidtn(req, res, next) {
    try {
        workSchema.parse(req.body)
        next()
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    }
}

module.exports = {
    userValidtn,
    uplUserValidtn,
    scheduleValidtn,
    uplSubtaskValidtn,
    taskValidtn,
    uplTaskValidtn,
    workValidtn
}
