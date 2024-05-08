const { product } = require("../models/product.model");
const { category } = require("../models/category.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");

async function createProduct(params, callback) {
    if (!params.productName) {
        return callback(
            {
                message: "Product Name required",
            },
            ""
        );
    }
    if (!params.category) {
      return callback(
        {
          message: "Category required",
        },
        ""
      );
    }

    const productModel = new product(params);
    productModel.save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
        return callback(error)
    })
}

async function getProducts(params, callback) {
    const productName = params.productName;
    const categoryId = params.categoryId;
  var condition = {};

    if (productName) {
        condition["productName"] = {
            $regex: new RegExp(productName), $options: "i"
        };
    }
    if (categoryId) {
        condition["category"] = categoryId;
    }
    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    product
      .find(
        condition,
        "productId productName productShortDescription productPrice productSalePrice productImage productSKU productType stockStatus"
      )
      .populate("category", "categoryName categoryImage")
      .limit(perPage)
      .skip(perPage * page)
      .then((response) => {
        return callback(null, response);
      })
      .catch((error) => {
        return callback(error);
      });
}

async function getProductById(params, callback) {
  const productId = params.productId;

    product
    .findById(productId,)
    .populate("category", "categoryName categoryImage")
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}


async function updateProduct(params, callback) {
  const productId = params.productId;

    product
      .findByIdAndUpdate(productId, params,{useFindAndModify: false})
      .then((response) => {
        if (!response) {
          callback(`Not Found Product with Id ${productId}`);
        } else callback(null, response);
      })
      .catch((error) => {
        return callback(error);
      });
}


async function deleteProduct(params, callback) {
  const productId = params.productId;

    product
      .findByIdAndDelete(productId)
      .then((response) => {
        if (!response) {
          callback(`Cannot delete Product with id ${productId}`);
        } else return callback(null, response);
      })
      .catch((error) => {
        return callback(error);
      });
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
