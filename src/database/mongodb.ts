import * as mongoose from "mongoose";
import * as bluebird from "bluebird";

export class DatabaseProvider {
    public static initConnection() {
        (<any>mongoose).Promise = bluebird;
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
