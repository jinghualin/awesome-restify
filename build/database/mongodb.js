"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bluebird = require("bluebird");
class DatabaseProvider {
    static initConnection() {
        mongoose.Promise = bluebird;
        const options = {
            autoIndex: true,
            reconnectInterval: 500,
            autoReconnect: true,
            poolSize: 10
        };
        mongoose.connect("mongodb://localhost:27017/dev", options).then(() => {
            console.log(`connected`);
        }).catch(err => {
            console.log(err);
        });
    }
}
exports.DatabaseProvider = DatabaseProvider;
//# sourceMappingURL=mongodb.js.map