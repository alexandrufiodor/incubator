"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = void 0;
let products = [{
        id: 1,
        title: 'orange',
    }, {
        id: 2,
        title: 'tomato',
    }];
exports.productRepository = {
    findProducts(title) {
        let foundProducts = products;
        if (title) {
            foundProducts = products.filter(product => product.title.toLowerCase().includes(title));
        }
        return foundProducts;
    },
    findProductById(id) {
        return products.find(product => product.id === id);
    },
    createProduct(title) {
        var _a;
        const newProduct = { id: ((_a = products === null || products === void 0 ? void 0 : products[(products === null || products === void 0 ? void 0 : products.length) - 1]) === null || _a === void 0 ? void 0 : _a.id) + 1 || 1, title };
        products = [...products, newProduct];
        return newProduct;
    },
    updateProduct(id, title) {
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index].title = title;
        }
        return products;
    },
    deleteProduct(id) {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
