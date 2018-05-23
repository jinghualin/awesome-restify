import { Next } from "restify";

export class TokenManager {
    public verify( req: Request, res: Response, next: Next ) {
        let token = req.headers["x-broncos-token"];
        if(!token) {

        }
    }
}