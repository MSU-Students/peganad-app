import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

export default localDB;