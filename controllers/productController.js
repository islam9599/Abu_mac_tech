const assert = require("assert");
const Definer = require("../lib/mistake");
const Product = require("../models/Product");

let productController = module.exports;

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");

    const product = new Product();
    const result = await product.getAllProductsData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
productController.getAllProductsByBrand = async (req, res) => {
  try {
    console.log("get: cont/getAllProductsByBrand");

    const product = new Product();
    const result = await product.getAllProductsByBrandData(req.body, req.query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProductsByBrandData, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
productController.getProductsByPriceRange = async (req, res) => {
  try {
    console.log("POST: cont/getProductsByPriceRange");
    const query = req.query;

    const product = new Product();
    const result = await product.getProductsByPriceRangeData(query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getProductsByPriceRange, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getAllSaleProducts = async (req, res) => {
  try {
    console.log("GET: cont/getAllSaleProducts");
    const data = req.query;

    const product = new Product();
    const result = await product.getAllSaleProductsData(req.member, data);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllSaleProducts, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getChosenProduct = async (req, res) => {
  try {
    console.log("GET: cont/getChosenProduct");
    const id = req.params.id;

    const product = new Product();
    const result = await product.getChosenProductData(req.member, id);

    res.json({ state: "success", data: result });
  } catch (error) {
    console.log(`ERROR, cont/getChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
productController.getChosenProductReview = async (req, res) => {
  try {
    console.log("GET: cont/getChosenProduct");
    const id = req.params.id;

    const product = new Product();
    const result = await product.getChosenProductReview(req.member, req.body);
    console.log("result =>", result);

    res.json({ state: "success", data: result });
  } catch (error) {
    console.log(`ERROR, cont/getChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

/******************************************
 *             BSSR related methods       *
 ******************************************/

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");

    assert(req.files, Definer.general_err3);
    const product = new Product();
    let data = req.body;
    data.product_images = req.files.map((ele) => {
      return ele.path;
    });

    const result = await product.addNewProductData(data, req.member);
    assert.ok(result, Definer.product_err1);

    const html = `<script>
                    alert('new product added successfully');
                    window.location.replace("/abu_tech/products/menu")
                  </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewProduct, ${err.message}`);
  }
};
productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
    const product = new Product();
    const id = req.params.id;
    console.log(id);
    const result = await product.updateChosenProductData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
