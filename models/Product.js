const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const assert = require("assert");
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const ReviewModel = require("../schema/review.model");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
    this.reviewModel = ReviewModel;
  }

  async getAllProductsData(member, data, inquiry) {
    try {
      const min_price = data.min_price,
        max_price = data.max_price;
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let match = {
        product_status: "PROCESS",
        product_name: {
          $regex: ".*" + data.searchText + ".*",
          $options: "i",
        },
        product_price: { $gte: min_price, $lte: max_price },
      };

      let aggregationQuery = [];
      // if (data.searchText && inquiry) {
      //   match["$text"] = { $search: data.searchText };
      // }

      data.limit = data["limit"] * 1;
      data.page = data["page"] * 1;

      switch (data.order) {
        case "all":
          aggregationQuery.push({
            $match: match,
          });
          break;
        case "collection":
          match["product_collection"] = data.product_collection;
          aggregationQuery.push({ $match: match });
          break;
        case "brand":
          match["product_brand"] = data.product_brand;
          aggregationQuery.push({
            $match: match,
          });
          break;
        case "sale":
          match["is_onsale"] = true;
          aggregationQuery.push({
            $match: match,
          });
          break;
        default:
          aggregationQuery.push({ $match: match });
          const sort = { [data.order]: -1 };
          aggregationQuery.push({ $sort: sort });
          break;
      }
      aggregationQuery.push({ $skip: (data.page - 1) * data.limit });
      aggregationQuery.push({ $limit: data.limit });

      aggregationQuery.push(lookup_auth_member_liked(auth_mb_id));
      const result = await this.productModel.aggregate(aggregationQuery).exec();
      assert.ok(result, Definer.general_err1);

      const filtered = await ProductModel.find({
        product_price: { $gte: min_price, $lte: max_price },
      });
      assert.ok(filtered, Definer.general_err1);

      const combinedResults = result.concat(filtered);

      return result;
    } catch (err) {
      throw err;
    }
  }
  async getAllProductsByBrandData(data, inquiry) {
    try {
      let match = {
        product_status: "PROCESS",
      };
      if (data.searchText && data.min_price && max_price) {
        match["$text"] = { $search: data.searchText };
        match["product_price"] = {
          $gte: data.min_price,
          $lte: data.max_price,
        };
      }
      const sort =
        data.order === "product_views"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
        ])
        .exec();

      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }
  async getProductsByPriceRangeData(inquiry) {
    try {
      const min_price = inquiry.min_price,
        max_price = inquiry.max_price;

      const result = await ProductModel.find({
        product_price: { $gte: min_price, $lte: max_price },
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllSaleProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let match = {
        is_onsale: true,
        product_status: "PROCESS",
      };

      data.limit = data["limit"] * 1;
      data.page = data["page"] * 1;

      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      // console.log(member._id);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if (member) {
        const member_object = new Member();
        await member_object.viewChosenItemByMember(member, id, "product");
      }

      const result = await this.productModel
        .aggregate([
          { $match: { _id: id, product_status: "PROCESS" } },
          {
            $lookup: {
              from: "products",
              localField: "product_collection",
              foreignField: "product_collection",
              as: "related_collection",
            },
          },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductReview(member, data) {
    try {
      mb_id = shapeIntoMongooseObjectId(member._id);
      // console.log(data);
      const new_review = new this.reviewModell(data);
      const result = await new_review.save();
      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsDataResto(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      // console.log(member._id);
      const result = await this.productModel.find({
        shop_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addNewProductData(data, member) {
    try {
      data.shop_mb_id = shapeIntoMongooseObjectId(member._id);
      // console.log(data);

      const new_product = new this.productModel(data);
      const result = await new_product.save();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const result = await this.productModel
        .findOneAndUpdate({ _id: id, shop_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
