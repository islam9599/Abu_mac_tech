const mongoose = require("mongoose");
const { like_view_group_list, board_id_enum_list } = require("../lib/config");
const schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    mb_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    review_ref_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: {
      type: Number,
      require: false,
    },
    comment: {
      type: String,
      require: false,
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Review", reviewSchema);
