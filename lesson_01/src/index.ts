import express, {Request, Response} from 'express';
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CreateCourseModel} from "./models/CreateCourseModel";
import { UpdateCourseModel } from './models/UpdateCourseModel';
import { QueryCoursesModel } from './models/QueryCoursesModel';
import { URIParamsCourseIdModel } from './models/URIParamsCourseIdModel';
import { CourseViewModel } from './models/CourseViewModel';

const app = express()
const port = 3000

type CourseType = {
  id: number
  title: string
  studentsCount: number
}
const db: { courses: CourseType[] } = {
  courses: [
    {id: 1, title: 'front-end', studentsCount: 1},
    {id: 2, title: 'back-end', studentsCount: 1},
    {id: 3, title: 'automation qa', studentsCount: 1},
    {id: 4, title: 'devops', studentsCount: 1},
  ]
}

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title
  }
}

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>, res: Response<CourseViewModel[]>) => {
  let foundCourses = db.courses;

  if (req.query.title) {
    foundCourses = db.courses.filter(course => course.title.toLowerCase().includes(req.query.title.toLowerCase()));
  }
  res.json(foundCourses.map(getCourseViewModel));
})

app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res:  Response<CourseViewModel>) => {
  const foundCourseById = db.courses.find(course => course.id === +req.params.id);

  if (!foundCourseById) {
    res.sendStatus(404);
    return;
  }
  res.json(getCourseViewModel(foundCourseById));
})

app.post('/courses', (req: RequestWithBody<CreateCourseModel>, res: Response<CreateCourseModel>) => {
  if (!req?.body?.title) {
    res.sendStatus(400)
    return
  }
  const createdCourse = {id: db.courses[db.courses?.length -1]?.id + 1, title: req?.body?.title, studentsCount: 0}
  db.courses.push(createdCourse);
  res.status(201).json(getCourseViewModel(createdCourse));
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res) => {
  const foundCourseById = db.courses.find(course => course.id === +req.params.id);

  if (!foundCourseById) {
    res.status(404).send('No course found.');
    return;
  }
  db.courses = db.courses.map(course => {
    if (course.id === +req.params.id) {
      return {...course, title: req.body.title};
    }
    return {...course};
  })
  res.status(200).json(db.courses);
})

app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
  const foundCourseById = db.courses.find(course => course.id === +req.params.id);
  if (!foundCourseById) {
    res.status(404).send('No course found.');
    return;
  }
  db.courses = db.courses.filter(course => course.id !== +req.params.id);
  res.sendStatus(204);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
