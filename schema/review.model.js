const mongoose = require("mongoose");
const { like_view_group_list, board_id_enum_list } = require("../lib/config");
const schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    mb_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    review_ref_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    product_rating: {
      type: Number,
    },
    product_comment: {
      type: String,
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Review", reviewSchema);
