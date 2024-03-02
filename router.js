const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController.js");
const productController = require("./controllers/productController.js");
const shopController = require("./controllers/shopController.js");
const orderController = require("./controllers/orderController.js");
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
  "/member-liken",
  memberController.retrieveAuthMember,
  memberController.likeMemberChosen
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
router.post(
  "/products/:id/review",
  memberController.retrieveAuthMember,
  productController.getChosenProductReview
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

// Orders related routers

router.post(
  "/orders/create",
  memberController.retrieveAuthMember,
  orderController.createOrder
);
router.get(
  "/orders",
  memberController.retrieveAuthMember,
  orderController.getMyOrders
);

router.post(
  "/orders/edit",
  memberController.retrieveAuthMember,
  orderController.editChosenOrder
);
module.exports = router;
