class Definer {
  // General errors
  static general_err1 = "Att: something went wrong!";
  static general_err2 = "Att: there is no data with that params!";
  static general_err3 = "Att: file upload error!";

  /**  member auth related errors*/

  static auth_err2 = "Att: jwt creation err!";
  static auth_err3 = "Att: no member with that mb_nick!";
  static auth_err4 = "Att: your credintials do not match!";
  static auth_err5 = "Att: you are not authenticated!";

  /** product related errors */
  static product_err1 = "Att: product creation is failed";

  /** order related errors */
  static order_err1 = "Att: order creation is falied";
  static order_err2 = "Att: order items creation is falied";
  static order_err3 = "Att: no order with that params exist!";

  /** articles related errors */
  static article_err1 = "Att: author member for articles not exist!";
  static article_err2 = "Att: no articles found with that member!";
  static article_err3 = "Att: no articles found with that target!";

  /** follow related errors */
  static follow_err1 = "Att: no self subcribtion allowed!";
  static follow_err2 = "Att: new follow creation is falied!";
  static follow_err3 = "Att: no follow data found!";

  /** db related errors */
  static mongodb_validation_err = "Att: mongodb validation is failed!";
}

module.exports = Definer;
