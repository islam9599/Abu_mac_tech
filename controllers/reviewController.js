const assert = require("assert");
const Definer = require("../lib/mistake");
const Review = require("../models/Review");

let reviewController = module.exports;

reviewController.createReview = async (req, res) => {
  try {
    console.log("POST, cont/createReview");
    assert.ok(req.member, Definer.general_err1);
    const review_ref_id = req.body.review_ref_id;
    const review = new Review();
    const result = await review.createReviewData(
      req.member,
      review_ref_id,
      req.body
    );
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createReview`);
    res.json({ state: "fail", message: err.message });
  }
};

reviewController.getChosenProductReviews = async (req, res) => {
  try {
    console.log("GET, cont/getChosenProductReviews");

    const review = new Review();
    const result = await review.getChosenProductReviewsData(req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenProductReviews`);
    res.json({ state: "fail", message: err.message });
  }
};
