const assert = require("assert");
const Definer = require("../lib/mistake");
const Community = require("../models/Community");
const Event = require("../models/Event");

let eventController = module.exports;

eventController.imageInsertion = async (req, res) => {
  try {
    console.log("POST, cont/imageInsertion");
    assert.ok(req.file, Definer.general_err3);

    const image_url = req.file.path;
    res.json({ state: "success", data: image_url });
  } catch (err) {
    console.log(`ERROR, cont/imageInsertion`);
    res.json({ state: "fail", message: err.message });
  }
};
eventController.getAllActiveEvents = async (req, res) => {
  try {
    console.log("GET cont/getAllEvents");

    const event = new Event();

    const event_data = await event.getAllActiveEventsData();

    // console.log("shops_data:", shops_data);

    res.render("all-events", { data: event_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllEvents`);
    res.json({ state: "fail", message: err.message });
  }
};

eventController.createEvent = async (req, res) => {
  try {
    console.log("POST, cont/createEvent");
    assert(req.files, Definer.general_err3);

    let data = req.body;
    // console.log(data);
    data.event_images = req.files.map((ele) => {
      return ele.path;
    });

    const event = new Event();
    const result = await event.createEventData(data, req.member);
    assert.ok(result, Definer.general_err1);
    const html = `<script>
                    alert('new event added successfully');
                    window.location.replace("/abu_tech/all-shops")
                  </script>`;
    res.end(html);
    // res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createEvent`);
    const html = `<script>
                    alert('mongo db err:::');
                    window.location.replace("/abu_tech/all-shops")
                  </script>`;
    res.end(html);
  }
};

eventController.updateEventByAdmin = async (req, res) => {
  try {
    console.log("POST cont/updateEventByAdmin");

    const shop = new Event();

    const result = await shop.updateEventByAdminData(req.body);

    // console.log(result);

    await res.json({ state: "success", event_data: result });
  } catch (err) {
    console.log("ERROR, cont/updateEventByAdmin");
    res.json({ state: "fail", message: err.message });
  }
};
