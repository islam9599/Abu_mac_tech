const mongoose = require("mongoose");
const { event_status_enum_list } = require("../lib/config");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema(
  {
    event_subject: { type: String, required: true },
    event_content: { type: String, required: true },
    event_images: { type: Array, required: false, default: [] },
    event_date: { type: String, required: false },
    // event_id: {
    //   type: String,
    //   required: true,
    // },
    event_status: {
      type: String,
      required: false,
      default: "deleted",
      enum: { values: event_status_enum_list },
      message: "{Value} is not among permitted values",
    },
    event_likes: { type: Number, required: false, default: 0 },
    event_views: { type: Number, required: false, default: 0 },
    mb_id: { type: Schema.Types.ObjectId, ref: "Member", required: false },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Event", eventSchema);
