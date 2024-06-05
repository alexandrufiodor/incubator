"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoutes = void 0;
const express_1 = require("express");
const videos_repository_1 = require("../repositories/videos-repository");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares/middlewares");
exports.videosRoutes = (0, express_1.Router)();
const titleValidation = (0, express_validator_1.body)('title')
    .notEmpty()
    .withMessage('Title field is required.')
    .trim()
    .isLength({ min: 0, max: 40 })
    .withMessage('Title length should be from 0 to 40 symbols');
const authorValidation = (0, express_validator_1.body)('author')
    .notEmpty()
    .withMessage('Author field is required.')
    .trim()
    .isLength({ min: 0, max: 20 })
    .withMessage('Author length should be from 0 to 20 symbols');
const availableResolutionsValidation = (0, express_validator_1.body)('availableResolutions')
    .if((0, express_validator_1.body)('availableResolutions').exists({ checkNull: true, checkFalsy: true }))
    .isIn(['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'])
    .withMessage('Resolution should be one from the \'P144\', \'P240\', \'P360\', \'P480\', \'P720\', \'P1080\', \'P1440\', \'P2160');
const minAgeRestriction = (0, express_validator_1.body)('minAgeRestriction')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 18 })
    .withMessage('Age must be an integer between 1 and 18.');
exports.videosRoutes.get('/', (req, res) => {
    res.send(videos_repository_1.videosRepository.findAllVideos());
});
exports.videosRoutes.get('/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
    }
    const findVideo = videos_repository_1.videosRepository.findVideosById(+req.params.id);
    if (!findVideo) {
        res.sendStatus(404);
    }
    res.send(findVideo);
});
exports.videosRoutes.post('/', titleValidation, authorValidation, availableResolutionsValidation, middlewares_1.inputValidationMiddleware, (req, res) => {
    var _a, _b, _c;
    res.status(201).send(videos_repository_1.videosRepository.createVideo((_a = req.body) === null || _a === void 0 ? void 0 : _a.title, (_b = req.body) === null || _b === void 0 ? void 0 : _b.author, (_c = req.body) === null || _c === void 0 ? void 0 : _c.availableResolutions));
});
exports.videosRoutes.put('/:id', titleValidation, authorValidation, availableResolutionsValidation, minAgeRestriction, middlewares_1.inputValidationMiddleware, (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
    }
    const findVideo = videos_repository_1.videosRepository.findVideosById(+req.params.id);
    if (!findVideo) {
        res.sendStatus(404);
    }
    res.status(200).json(videos_repository_1.videosRepository.updateVideo(+req.params.id, req.body));
});
exports.videosRoutes.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
    }
    if (videos_repository_1.videosRepository.deleteVideo(+req.params.id)) {
        res.send(204);
    }
    res.sendStatus(404);
});
//# sourceMappingURL=videos-routes.js.map