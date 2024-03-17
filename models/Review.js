const assert = require("assert");
const ReviewModel = require("../schema/review.model");
const MemberModel = require("../schema/member.model");
const BoArticleModel = require("../schema/bo_article.model");
const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Member = require("./Member");

class Review {
  constructor(mb_id) {
    this.reviewModel = ReviewModel;
    this.memberModel = MemberModel;
    this.boArticleModel = BoArticleModel;
    this.productModel = ProductModel;
    this.mb_id = mb_id;
  }
  async createReviewData(member, review_ref_id, data) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member?._id);
      review_ref_id = shapeIntoMongooseObjectId(review_ref_id);
      const review = new Review(mb_id);

      const updated_data = await review.insertMemberReview(review_ref_id, data);
      assert.ok(data, Definer.general_err1);

      const result = {
        review_ref_id: data.review_ref_id,
        review_data: updated_data,
      };
      return result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberReview(review_ref_id, data) {
    try {
      const new_review = new this.reviewModel({
        mb_id: this.mb_id,
        review_ref_id: review_ref_id,
        product_comment: data.product_comments,
        product_rating: data.product_ratings,
      });

      const result = await new_review.save();
      await this.modifyProductReview(review_ref_id, data);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.mongodb_validation_err);
    }
  }
  async modifyProductReview(review_ref_id, data) {
    try {
      let product_reviews = {
        product_ratings: data.product_ratings,
        product_comments: data.product_comments,
        mb_id: this.mb_id,
      };
      const result = await this.productModel
        .findOneAndUpdate(
          {
            _id: review_ref_id,
          },
          {
            $push: {
              product_reviews: product_reviews,
            },
          }
        )
        .exec();

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductReviewsData(inquiry) {
    try {
      const review_ref_id = shapeIntoMongooseObjectId(inquiry.review_ref_id),
        page = inquiry.page * 1,
        limit = inquiry.limit * 1;
      const result = await this.reviewModel
        .aggregate([
          { $match: { review_ref_id: review_ref_id } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
        ])
        .exec();
      assert.ok(result, Definer.general_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Review;
