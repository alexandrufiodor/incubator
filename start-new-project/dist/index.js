"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
let products = [{
        id: 1,
        title: 'orange',
    }, {
        id: 2,
        title: 'tomato',
    }];
app.get('/products', (req, res) => {
    var _a;
    let findProducts = products;
    if ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.title) {
        findProducts = products.filter(product => { var _a, _b; return product.title.toLowerCase().includes((_b = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.toLowerCase()); });
    }
    res.send(findProducts);
});
app.get('/products/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
    }
    const findProduct = products.find(product => product.id === +req.params.id);
    if (!findProduct) {
        res.sendStatus(404);
    }
    res.send(findProduct);
});
app.post('/products', (req, res) => {
    var _a, _b, _c;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.title)) {
        res.status(400).send('Title is required!');
        return;
    }
    const newProduct = { id: ((_b = products === null || products === void 0 ? void 0 : products[(products === null || products === void 0 ? void 0 : products.length) - 1]) === null || _b === void 0 ? void 0 : _b.id) + 1, title: (_c = req.body) === null || _c === void 0 ? void 0 : _c.title };
    products = [...products, newProduct];
    return res.status(201).send(newProduct);
});
app.put('/products/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
        return;
    }
    const findProduct = products.find(product => product.id === +req.params.id);
    if (!findProduct) {
        res.sendStatus(404);
        return;
    }
    products = products.map(product => {
        if (product.id === +req.params.id) {
            return Object.assign(Object.assign({}, product), { title: req.body.title });
        }
        return Object.assign({}, product);
    });
    res.status(200).json(products);
});
app.delete('/products/:id', (req, res) => {
    if (!req.params.id) {
        res.sendStatus(404);
        return;
    }
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === +req.params.id) {
            products.splice(i, 1);
            return res.send(204);
        }
    }
    res.sendStatus(404);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
