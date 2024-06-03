"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesRepository = void 0;
let addresses = [{
        id: 1,
        value: 'Chisinau',
    }, {
        id: 2,
        value: 'Tiraspol',
    }];
exports.addressesRepository = {
    findAddresses(value) {
        let foundAddresses = addresses;
        if (value) {
            foundAddresses = addresses.filter(address => address.value.toLowerCase().includes(value === null || value === void 0 ? void 0 : value.toLowerCase()));
        }
        return foundAddresses;
    },
    findAddressById(id) {
        return addresses.find(address => address.id === id);
    },
    createAddress(value) {
        var _a;
        const newAddress = { id: ((_a = addresses === null || addresses === void 0 ? void 0 : addresses[(addresses === null || addresses === void 0 ? void 0 : addresses.length) - 1]) === null || _a === void 0 ? void 0 : _a.id) + 1 || 1, value };
        addresses = [...addresses, newAddress];
        return newAddress;
    },
    updateAddress(id, value) {
        const index = addresses.findIndex(address => address.id === id);
        if (index !== -1) {
            addresses[index].value = value;
        }
        return addresses;
    },
    deleteAddress(id) {
        for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].id === id) {
                addresses.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
