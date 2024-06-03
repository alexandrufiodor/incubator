let products = [{
  id: 1,
  title: 'orange',
}, {
  id: 2,
  title: 'tomato',
}]

export const productRepository = {
  findProducts(title: string) {
    let foundProducts = products
    if (title) {
      foundProducts = products.filter(product => product.title.toLowerCase().includes(title));
    }
    return foundProducts
  },
  findProductById(id: number) {
    return products.find(product => product.id === id);
  },
  createProduct(title: string) {
    const newProduct = {id: products?.[products?.length -1]?.id + 1 || 1, title}
    products = [...products, newProduct]
    return newProduct;
  },
  updateProduct(id: number, title: string) {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index].title = title;
    }
    return products;
  },
  deleteProduct(id: number) {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        products.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}
