const mongoose = require("mongoose");
const { event_status_enum_list } = require("../lib/config");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema(
  {
    event_subject: { type: String, required: true },
    event_content: { type: String, required: true },
    event_image: { type: String, required: false },
    event_date: { type: String, required: false },
    // event_id: {
    //   type: String,
    //   required: true,
    // },
    event_status: {
      type: String,
      required: false,
      default: "active",
      enum: { values: event_status_enum_list },
      message: "{Value} is not among permitted values",
    },
    event_likes: { type: Number, required: false, default: 0 },
    event_views: { type: Number, required: true, default: 0 },
    mb_id: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Event", eventSchema);
