let addresses = [{
  id: 1,
  value: 'Chisinau',
}, {
  id: 2,
  value: 'Tiraspol',
}]
export const addressesRepository = {
  findAddresses(value: string) {
    let foundAddresses = addresses
    if (value) {
      foundAddresses = addresses.filter(address => address.value.toLowerCase().includes(value?.toLowerCase()));
    }

    return foundAddresses
  },
  findAddressById(id: number) {
    return addresses.find(address => address.id === id);
  },
  createAddress(value: string) {
    const newAddress = {id: addresses?.[addresses?.length -1]?.id + 1 || 1, value}
    addresses = [...addresses, newAddress]
    return newAddress
  },
  updateAddress(id: number, value: string) {
      const index = addresses.findIndex(address => address.id === id);
      if (index !== -1) {
          addresses[index].value = value;
      }
    return addresses;
  },
  deleteAddress(id: number) {
      for (let i = 0; i < addresses.length; i++) {
        if (addresses[i].id === id) {
          addresses.splice(i, 1);
          return true;
        }
      }
      return false;
  }
}
