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

  async validateTargetItem(id, group_type) {
    try {
      let result;

      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({
              _id: id,
              mb_status: "ACTIVE",
            })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .findOne({
              _id: id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "community":
          result = await this.boArticleModel
            .findOne({
              _id: id,
              art_status: "active",
            })
            .exec();
        default:
          break;
      }

      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async checkLikeExistence(like_ref_id) {
    try {
      const like = await this.reviewModel
        .findOne({
          mb_id: this.mb_id,
          like_ref_id: like_ref_id,
        })
        .exec();
      console.log("like:::", like);
      return !!like;
    } catch (err) {
      throw err;
    }
  }
  async removeMemberLike(like_ref_id, group_type) {
    try {
      const result = await this.reviewModel
        .findOneAndDelete({
          mb_id: this.mb_id,
          like_ref_id: like_ref_id,
        })
        .exec();

      await this.modifyItemLikeCounts(like_ref_id, group_type, -1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async insertMemberLike(like_ref_id, group_type) {
    try {
      const new_like = new this.reviewModel({
        mb_id: this.mb_id,
        like_ref_id: like_ref_id,
        like_group: group_type,
      });

      const result = await new_like.save();

      await this.modifyItemLikeCounts(like_ref_id, group_type, 1);

      return result;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.mongodb_validation_err);
    }
  }
  async modifyItemLikeCounts(like_ref_id, group_type, modifier) {
    try {
      switch (group_type) {
        case "member":
          await this.memberModel
            .findByIdAndUpdate(
              {
                _id: like_ref_id,
              },
              { $inc: { mb_likes: modifier } }
            )
            .exec();
          break;
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              {
                _id: like_ref_id,
              },
              { $inc: { product_likes: modifier } }
            )
            .exec();
          break;
        case "community":
          await this.boArticleModel
            .findByIdAndUpdate(
              {
                _id: like_ref_id,
              },
              { $inc: { art_likes: modifier } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Review;
