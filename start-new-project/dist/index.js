"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const products_routes_1 = require("./routes/products-routes");
const addresses_routes_1 = require("./routes/addresses-routes");
exports.app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/products', products_routes_1.productsRoutes);
exports.app.use('/addresses', addresses_routes_1.addressesRoutes);
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
