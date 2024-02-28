const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController.js");
const productController = require("./controllers/productController.js");
const shopController = require("./controllers/shopController.js");
const uploader_member = require("./utils/upload-multer.js")("members");

/**********************************
 *             REST API           *
 **********************************/

// Member related routers

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);
router.post(
  "/member/update",
  memberController.retrieveAuthMember,
  uploader_member.single("mb_image"),
  memberController.updateMember
);

// Products related routers

router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

router.get(
  "/products/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

// Shops related routers

router.get(
  "/shops",
  memberController.retrieveAuthMember,
  shopController.getShops
);

router.get(
  "/shops/:id",
  memberController.retrieveAuthMember,
  shopController.getChosenShop
);

module.exports = router;
