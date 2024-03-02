const assert = require("assert");
const Definer = require("../lib/mistake");
const Review = require("../models/Review");

let reviewController = module.exports;

reviewController.createReview = async (req, res) => {
  try {
    console.log("POST, cont/createArticle");
    assert.ok(req.member, Definer.general_err1);

    const review = new Review();
    const result = await review.createArticleData(req.member, req.body);
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createArticle`);
    res.json({ state: "fail", message: err.message });
  }
};
reviewController.getMemberArticles = async (req, res) => {
  try {
    console.log("GET, cont/getMemberArticles");
    const community = new Review();

    const mb_id =
      req.query.mb_id !== "none" ? req.query.mb_id : req.member?._id;
    assert.ok(mb_id, Definer.article_err1);

    const result = await community.getMemberArticlesData(
      req.member,
      mb_id,
      req.query
    );
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMemberArticles`);
    res.json({ state: "fail", message: err.message });
  }
};
reviewController.getArticles = async (req, res) => {
  try {
    console.log("GET, cont/getArticles");

    const community = new Review();
    const result = await community.getArticlesData(req.member, req.query);
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getArticles`);
    res.json({ state: "fail", message: err.message });
  }
};
reviewController.getChosenArticle = async (req, res) => {
  try {
    console.log("GET, cont/getChosenArticle");

    const art_id = req.params.art_id;

    const community = new Review();
    const result = await community.getChosenArticleData(req.member, art_id);
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenArticle`);
    res.json({ state: "fail", message: err.message });
  }
};
