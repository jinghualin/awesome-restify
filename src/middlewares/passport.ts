import * as passport from "passport-restify";
import { User } from "../models/user";

// passport.serializeUser<any, any>((user, done) => {
//     done(null, user.id);
// });
// passport.deserialize((id, done)=>{
//     User.findById(id, (err, user) =>{
//         done(err, user);
//     })
// });