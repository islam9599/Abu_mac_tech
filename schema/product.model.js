const mongoose = require("mongoose");

const {
  product_collection_enums,
  product_status_enums,
  product_volume_enums,
  product_display_enums,
  product_memory_enums,
  product_hard_storage_enums,
  product_colors_enums: product_graphics_enums,
  product_chip_enums,
  product_colors_enums,
  product_brands_enums,
} = require("../lib/config");
const reviewModel = require("./review.model");

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{value} is not among permitted enum values",
      },
    },
    product_status: {
      type: String,
      required: false,
      default: "PAUSED",
      enum: {
        values: product_status_enums,
        message: "{value} is not among permitted enum values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      required: false,
      default: 0,
      enum: {
        values: [10, 20, 30],
        message: "{value} is not among permitted enum values",
      },
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },
    product_display: {
      type: Number,
      required: false,
      enum: {
        values: product_display_enums,
        message: "{value} is not among permitted enum values",
      },
    },
    product_memory: {
      type: Number,
      required: true,
      enum: {
        values: product_memory_enums,
        message: "{value} is not among permitted enum values",
      },
    },
    product_storage: {
      type: Number,
      required: false,
      enum: {
        values: product_hard_storage_enums,
        message: "{value} is not among permitted enum values",
      },
    },
    product_color: {
      type: String,
      required: false,
      default: "gold",
      enum: {
        values: product_colors_enums,
        message: "{value} is not among permitted enum values",
      },
    },
    is_onsale: { type: Boolean, default: false },
    product_brand: {
      type: String,
      required: false,
      default: "apple",
      // required:
      //  function () {
      //   const sized_list = ["dish", "salad", "dessert"];
      //   return sized_list.includes(this.product_collection);
      // },

      enum: {
        values: product_brands_enums,
        message: "{value} is not among permitted enum values",
      },
    },
    // product_volume: {
    //   type: Number,
    //   default: 1,
    //   required: function () {
    //     return this.product_collection === "drink";
    //   },
    //   enum: {
    //     values: product_volume_enums,
    //     message: "{value} is not among permitted enum values",
    //   },
    // },
    product_description: {
      type: String,
      required: true,
    },
    product_images: {
      type: Array,
      required: false,
      default: [],
    },
    product_likes: {
      type: Number,
      required: false,
      default: 0,
    },

    product_views: {
      type: Number,
      required: false,
      default: 0,
    },
    rating: {
      type: Number,
      require: true,
    },
    comment: {
      type: String,
      require: true,
    },
    shop_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true } // createdAt &&& updatedAt
);

productSchema.index(
  {
    shop_mb_id: 1,
    product_name: 1,
    product_memory: 1,
  }, // Texas-De-Brazilcoca-colanull?
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);
