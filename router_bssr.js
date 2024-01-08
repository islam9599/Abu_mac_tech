const express = require("express");
const router_bssr = express.Router();
const shopController = require("./controllers/shopController");
const productController = require("./controllers/productController");
const eventController = require("./controllers/eventController");
const uploader_product = require("./utils/upload-multer")("products");
const uploader_members = require("./utils/upload-multer")("members");
const uploader_event = require("./utils/upload-multer.js")("event");

/**********************************
 *            BSSR EJS     *
 **********************************/

// Member related

router_bssr.get("/", shopController.home);

router_bssr
  .get("/sign-up", shopController.getSignupMyShop)
  .post(
    "/sign-up",
    uploader_members.single("shop_img"),
    shopController.signupProcess
  );

router_bssr
  .get("/login", shopController.getLoginMyShop)
  .post("/login", shopController.loginProcess);

router_bssr.post(
  "/member/edit/:id",
  shopController.validateAuthShop,
  shopController.updateChosenShop
);

router_bssr.get("/logout", shopController.logout);
router_bssr.get("/check-me", shopController.checkSessions);

router_bssr.get(
  "/products/menu",
  shopController.validateAuthShop,
  shopController.getMyShopProducts
);
router_bssr.post(
  "/products/create",
  shopController.validateAuthShop,
  uploader_product.array("product_images", 5),
  productController.addNewProduct
);
router_bssr.post(
  "/products/edit/:id",
  shopController.validateAuthShop,
  productController.updateChosenProduct
);

// Other routers

router_bssr.get("/menu", function (req, res) {
  res.send("Menu sahifadasiz");
});

router_bssr.get("/community", function (req, res) {
  res.send("Community sahifadasiz");
});

router_bssr.get(
  "/all-shops",
  shopController.validateAdmin,
  shopController.getAllShop
);
router_bssr.post(
  "/all-shops/edit",
  shopController.validateAdmin,
  shopController.updateShopByAdmin
);

router_bssr.post(
  "/event/image",
  uploader_event.single("event_image"),
  eventController.imageInsertion
);
router_bssr.get(
  "/all-events",
  shopController.validateAdmin,
  eventController.getAllActiveEvents
);
router_bssr.post(
  "/event/create",
  shopController.validateAdmin,
  eventController.createEvent
);
router_bssr.post(
  "/all-events/edit",
  shopController.validateAdmin,
  eventController.updateEventByAdmin
);

module.exports = router_bssr;
