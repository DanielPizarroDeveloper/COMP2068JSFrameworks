const Product = require('../../models/product');
const { normalize_identifier } = require('../normalize');

const { handleFailedUpdate, handleFailedDelete, handleIncompleteForm, handleNotFoundData } = require('../../public/mocks/Message');

const createProduct = async(productName, productDescription, productQuantity, productUnit, today, productPrice, imgUrl) => {
    if(!productName || !productDescription || !productQuantity || !productUnit || !productPrice || !imgUrl) {
        throw new Error(handleIncompleteForm());
    }
    else {
        let newProduct = new Product({
          title: productName,
          detail: productDescription,
          quantity: productQuantity,
          unit: productUnit,
          publication: today,
          price: productPrice,
          imgProduct: imgUrl
        });

        await newProduct.save();
        return true;
    }
}

const getProduct = async () => {
    const products = await Product.find();
    if (products.length > 0) {
        const productsOrderBy = products.sort((a, b) => new Date(b.publication) - new Date(a.publication));
        return productsOrderBy;
    } else {
        throw Error(handleNotFoundData());
    }
}

const updatedProductByID = async(ID, productName, productDescription, productQuantity, today, productPrice, productImage) => {
    try {
        const productID = normalize_identifier(ID);

        let path = productImage.length;

        if (path > 0) {
          await Product.findByIdAndUpdate(
            { _id: productID },
            {
              title: productName,
              detail: productDescription,
              quantity: productQuantity,
              publication: today,
              price: productPrice,
              imgProduct: productImage
            }
          )
        } else {
          await Product.findByIdAndUpdate(
            { _id: productID },
            {
                title: productName,
                detail: productDescription,
                quantity: productQuantity,
                publication: today,
                price: productPrice
            }
          )
        }
        return true;
    } catch (error) {
        throw Error(handleFailedUpdate());
    }
}

const deleteProductByID = async(ID) => {
    try {
        const productID = normalize_identifier(ID);
        await Product.findByIdAndDelete(productID);
        return true;
    } catch (error) {
        throw new Error(handleFailedDelete());
    }
}

module.exports = {
    createProduct,
    getProduct,
    updatedProductByID,
    deleteProductByID
}