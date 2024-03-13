const mongoose = require("mongoose");
const { like_view_group_list, board_id_enum_list } = require("../lib/config");
const schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    mb_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: {
      type: Number,
      require: true,
    },
    comment: {
      type: String,
      require: true,
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Review", reviewSchema);
