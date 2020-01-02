import * as mongoose from "mongoose";

class Db {
  url;

  connect() {
    this.url = "mongodb://pi:serverpi3@ds259348.mlab.com:59348/pi";

    mongoose
      .connect(this.url)
      .then(() => console.log("connected db"))
      .catch(() => console.log("connected error"));
  }
}

export default new Db().connect;
