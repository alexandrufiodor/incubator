"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_1 = require("express");
const products_repository_1 = require("../repositories/products-repository");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares/middlewares");
exports.productsRoutes = (0, express_1.Router)();
const titleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 3, max: 10 }).withMessage('Title length should be from 3 to 10 symbols');
exports.productsRoutes.get('/', (req, res) => {
    var _a, _b;
    res.send(products_repository_1.productRepository.findProducts((_b = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.toLowerCase()));
});
exports.productsRoutes.get('/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
    }
    const findProduct = products_repository_1.productRepository.findProductById(+req.params.id);
    if (!findProduct) {
        res.sendStatus(404);
    }
    res.send(findProduct);
});
exports.productsRoutes.post('/', titleValidation, middlewares_1.inputValidationMiddleware, (req, res) => {
    var _a;
    return res.status(201).send(products_repository_1.productRepository.createProduct((_a = req.body) === null || _a === void 0 ? void 0 : _a.title));
});
exports.productsRoutes.put('/:id', titleValidation, middlewares_1.inputValidationMiddleware, (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
        return;
    }
    const findProduct = products_repository_1.productRepository.findProductById(+req.params.id);
    if (!findProduct) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(products_repository_1.productRepository.updateProduct(+req.params.id, req.body.title));
});
exports.productsRoutes.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
        return;
    }
    if (products_repository_1.productRepository.deleteProduct(+req.params.id)) {
        return res.send(204);
    }
    res.sendStatus(404);
});
