"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesRoutes = void 0;
const express_1 = require("express");
const addresses_repository_1 = require("../repositories/addresses-repository");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares/middlewares");
exports.addressesRoutes = (0, express_1.Router)();
const valueValidation = (0, express_validator_1.body)('value').trim().isLength({ min: 3, max: 10 }).withMessage('Value length should be from 3 to 10 symbols');
exports.addressesRoutes.get('/', (req, res) => {
    var _a;
    res.send(addresses_repository_1.addressesRepository.findAddresses((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.value));
});
exports.addressesRoutes.get('/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
    }
    const findAddress = addresses_repository_1.addressesRepository.findAddressById(+req.params.id);
    if (!findAddress) {
        res.sendStatus(404);
    }
    res.send(findAddress);
});
exports.addressesRoutes.post('/', valueValidation, middlewares_1.inputValidationMiddleware, (req, res) => {
    var _a;
    return res.status(201).send(addresses_repository_1.addressesRepository.createAddress((_a = req.body) === null || _a === void 0 ? void 0 : _a.value));
});
exports.addressesRoutes.put('/:id', valueValidation, middlewares_1.inputValidationMiddleware, (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
        return;
    }
    const findAddress = addresses_repository_1.addressesRepository.findAddressById(+req.params.id);
    if (!findAddress) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(addresses_repository_1.addressesRepository.updateAddress(+req.params.id, req.body.value));
});
exports.addressesRoutes.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
        return;
    }
    if (addresses_repository_1.addressesRepository.deleteAddress(+req.params.id)) {
        return res.send(204);
    }
    res.sendStatus(404);
});
