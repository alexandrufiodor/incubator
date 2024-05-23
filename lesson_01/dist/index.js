"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'automation qa' },
        { id: 4, title: 'devops' },
    ]
};
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
app.get('/courses', (req, res) => {
    const foundCourses = db.courses.filter(course => { var _a; return course === null || course === void 0 ? void 0 : course.title.includes(((_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString()) || ''); });
    if (!foundCourses) {
        res.status(404).send('No courses found.');
        return;
    }
    res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
    const foundCourseById = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourseById) {
        res.status(404).send('No course found.');
        return;
    }
    res.json(foundCourseById);
});
app.post('/courses', (req, res) => {
    var _a, _b, _c, _d;
    if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.title)) {
        res.status(400).send('Title is required.');
        return;
    }
    const createdCourse = { id: ((_c = db.courses[((_b = db.courses) === null || _b === void 0 ? void 0 : _b.length) - 1]) === null || _c === void 0 ? void 0 : _c.id) + 1, title: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.title };
    db.courses.push(createdCourse);
    res.status(201).json(createdCourse);
});
app.put('/courses/:id', (req, res) => {
    const foundCourseById = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourseById) {
        res.status(404).send('No course found.');
        return;
    }
    db.courses = db.courses.map(course => {
        if (course.id === +req.params.id) {
            return Object.assign(Object.assign({}, course), { title: req.body.title });
        }
        return Object.assign({}, course);
    });
    res.status(200).json(db.courses);
});
app.delete('/courses/:id', (req, res) => {
    const foundCourseById = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourseById) {
        res.status(404).send('No course found.');
        return;
    }
    db.courses = db.courses.filter(course => course.id !== +req.params.id);
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
