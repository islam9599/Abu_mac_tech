const assert = require("assert");
const Member = require("../models/Member");
const Product = require("../models/Product");
const Definer = require("../lib/mistake");
const Shop = require("../models/Shop");
const Event = require("../models/Event");

let shopController = module.exports;

shopController.getShops = async (req, res) => {
  try {
    console.log("GET: cont/getShops");
    const data = req.query;
    // console.log("query_data:::::", data);
    const shop = new Shop();
    const result = await shop.getShopsData(req.member, data);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getShops, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
shopController.getChosenShop = async (req, res) => {
  try {
    console.log("GET: cont/getChosenShop");
    const id = req.params.id;
    const shop = new Shop();
    const result = await shop.getChosenShopData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenShop, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

/******************************************
 *             BSSR related methods       *
 ******************************************/

shopController.home = async (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home-page, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.getMyShopProducts = async (req, res) => {
  try {
    console.log("GET, cont/getMyShopProducts");

    const product = new Product();
    const data = await product.getAllProductsDataResto(req.member);

    res.render("shop-menu", { shop_data: data });
  } catch (err) {
    console.log(`ERROR, cont/getMyShopProducts, ${err.message}`);
    res.redirect("/abu_tech");
  }
};

shopController.getSignupMyShop = async (req, res) => {
  try {
    console.log("GET, cont/getSignupMyShop");
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyShop, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.signupProcess = async (req, res) => {
  //   console.log("POST cont.signup");
  //   res.send("Signup sahifadasiz");
  try {
    console.log("POST, cont/signupProcess");
    // console.log(req.body);
    // console.log(req.file);

    assert(req.file, Definer.general_err3);

    let new_member = req.body;
    new_member.mb_type = "BRAND";
    new_member.mb_image = req.file.path;
    // console.log(`body:::`, req.body);
    const member = new Member();
    const result = await member.signupData(new_member);
    assert(result, Definer.general_err1);

    req.session.member = result;

    res.redirect("/abu_tech/products/menu");

    // res.json({ state: "success", data: new_member });
  } catch (err) {
    console.log(`ERROR, cont/signupProcess`);
    res.redirect("/abu_tech");
  }
};

shopController.getLoginMyShop = async (req, res) => {
  try {
    console.log("GET, cont/getLoginMyShop");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyShop, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.loginProcess = async (req, res) => {
  //   console.log("POST cont.login");
  //   res.send("Login sahifadasiz");
  try {
    console.log("POST, cont/loginProcess");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data);
    // console.log(result);
    // console.log(req.session.member);
    req.session.member = result;
    req.session.save(function () {
      result.mb_type === "ADMIN"
        ? res.redirect("/abu_tech/all-shops")
        : res.redirect("/abu_tech/products/menu");
    });

    // res.send("done");
    // res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/loginProcess`);
    // res.json({ state: "fail", message: err.message });
    const html = `<script>
                    alert('Login page: your credintials do not match!');
                    window.location.replace('/abu_tech/login')
                  </script>`;
    res.end(html);
  }
};

shopController.updateChosenShop = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenShop");
    const member = new Member();
    const id = req.params.id;
    console.log(id);
    const result = await member.updateChosenShopData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenShop, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.logout = (req, res) => {
  try {
    console.log("GET cont.logout");
    req.session.destroy(function () {
      res.redirect("/abu_tech");
    });
  } catch (err) {
    console.log(`ERROR, cont/logout`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.validateAuthShop = (req, res, next) => {
  if (req.session?.member?.mb_type === "BRAND") {
    req.member = req.session.member;
    // console.log(req.member);
    next();
  } else {
    const html = `<script>
                    alert('Login page: You are not authenticated user with permitted member type!');
                    window.location.replace('/abu_tech/login')
                  </script>`;
    res.end(html);
  }
};

shopController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "success", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated user" });
  }
};

shopController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;

    console.log(req.member);

    next();
  } else {
    const html = `<script>
                    alert('Admin  page: Permission denied');
                    window.location.replace('/abu_tech')
                  </script>`;
    res.end(html);
  }
};

shopController.getAllShop = async (req, res) => {
  try {
    console.log("GET cont/getAllShop");

    const shop = new Shop();
    const shops_data = await shop.getAllShopsData();

    const event = new Event();
    const events_data = await event.getAllEventsData();

    // console.log("shops_data:", shops_data);

    res.render("all-shops", {
      shops_data: shops_data,
      events_data: events_data,
    });
  } catch (err) {
    console.log(`ERROR, cont/getAllShop`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.updateShopByAdmin = async (req, res) => {
  try {
    console.log("POST cont/updateShopByAdmin");

    const shop = new Shop();

    const result = await shop.updateShopByAdminData(req.body);

    // console.log(result);

    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR, cont/updateShopByAdmin");
    res.json({ state: "fail", message: err.message });
  }
};
