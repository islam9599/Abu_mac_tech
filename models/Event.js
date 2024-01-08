const assert = require("assert");
const BoArticleModel = require("../schema/bo_article.model");
const EventModel = require("../schema/event.model");
const Definer = require("../lib/mistake");
const {
  shapeIntoMongooseObjectId,
  board_id_enum_list,
  lookup_auth_member_liked,
  event_status_enum_list,
} = require("../lib/config");
const Member = require("./Member");

class Event {
  constructor(mb_id) {
    this.boArticleModel = BoArticleModel;
    this.eventModel = EventModel;
  }

  async createEventData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);

      const new_event = await this.saveEvenData(data);
      assert.ok(new_event, Definer.general_err1);

      return new_event;
    } catch (err) {
      throw err;
    }
  }

  async saveEvenData(data) {
    try {
      const article = new this.eventModel(data);
      return await article.save();
    } catch (mongo_err) {
      console.log("mongo_err:::", mongo_err);
      throw new Error(Definer.mongodb_validation_err);
    }
  }

  async getAllEventsData() {
    try {
      const result = await this.eventModel
        .find({
          event_status: event_status_enum_list,
        })
        .exec();
      //   console.log(result);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getAllActiveEventsData() {
    try {
      const result = await this.eventModel
        .find({
          event_status: "active",
        })
        .exec();
      //   console.log(result);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async updateEventByAdminData(update_data) {
    try {
      const id = shapeIntoMongooseObjectId(update_data?.id);
      const result = await this.eventModel
        .findByIdAndUpdate({ _id: id }, update_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      //   console.log(result);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  // async getMemberArticlesData(member, mb_id, inquiry) {
  //   try {
  //     const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
  //     mb_id = shapeIntoMongooseObjectId(mb_id);
  //     const page = inquiry.page ? inquiry.page * 1 : 1;
  //     const limit = inquiry.limit ? inquiry.limit * 1 : 5;
  //     const result = await this.boArticleModel
  //       .aggregate([
  //         { $match: { mb_id: mb_id, art_status: "active" } },
  //         { $sort: { createdAt: -1 } },
  //         { $skip: (page - 1) * limit },
  //         { $limit: limit },
  //         {
  //           $lookup: {
  //             from: "members",
  //             localField: "mb_id",
  //             foreignField: "_id",
  //             as: "member_data",
  //           },
  //         },
  //         {
  //           $unwind: "$member_data",
  //         },
  //         lookup_auth_member_liked(auth_mb_id),
  //       ])
  //       .exec();
  //     assert.ok(result, Definer.article_err2);
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async getArticlesData(member, inquiry) {
  //   try {
  //     const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

  //     console.log(inquiry.bo_id);
  //     let matches =
  //       inquiry.bo_id === "all"
  //         ? { bo_id: { $in: board_id_enum_list }, art_status: "active" }
  //         : { bo_id: inquiry.bo_id, art_status: "active" };
  //     inquiry.limit *= 1;
  //     inquiry.page *= 1;
  //     const sort = inquiry.order
  //       ? { [`${inquiry.order}`]: -1 }
  //       : { createdAt: -1 };

  //     const result = await this.boArticleModel
  //       .aggregate([
  //         { $match: matches },
  //         { $sort: sort },
  //         { $skip: (inquiry.page - 1) * inquiry.limit },
  //         { $limit: inquiry.limit },
  //         {
  //           $lookup: {
  //             from: "members",
  //             localField: "mb_id",
  //             foreignField: "_id",
  //             as: "member_data",
  //           },
  //         },
  //         {
  //           $unwind: "$member_data",
  //         },
  //         lookup_auth_member_liked(auth_mb_id),
  //       ])
  //       .exec();
  //     assert.ok(result, Definer.article_err3);

  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async getChosenArticleData(member, art_id) {
  //   try {
  //     art_id = shapeIntoMongooseObjectId(art_id);

  //     if (member) {
  //       const member_object = new Member();
  //       await member_object.viewChosenItemByMember(member, art_id, "community");
  //     }

  //     const result = await this.boArticleModel
  //       .findById({
  //         _id: art_id,
  //       })
  //       .exec();
  //     assert.ok(result, Definer.article_err3);
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}

module.exports = Event;
