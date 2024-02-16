const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const ImageService = require("../service/ImageService");

const Schema = mongoose.Schema;



const staffSchema = new Schema({
  fullname: { type: String, default: "staff" },
  age: { type: Number, default: 0, min: 18, index: true },
  email: { type: String, unique: true, match: /[a-z]/ },
  username: {
    type: String,
    default: function () {
      return this.email ? this.email.split("@")[0] : "";
    },
  },
  country: { type: String },
  cardID: { type: String, unique: true },
  password: {
    type: String,
    default: function () {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(this.username, salt);
    },
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: "staff" },
  status: { type: String, default: "off" },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Staff", staffSchema);
