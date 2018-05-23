"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const controllers_1 = require("../controllers");
const jwt = require("restify-jwt-community");
const dotenv = require("dotenv");
const mongodb_1 = require("../database/mongodb");
const swaggerUI = require("swagger-ui-restify");
class ApiServer {
    get(url, ...requestHandler) {
        this.addRouter("get", url, ...requestHandler);
    }
    post(url, ...requestHandler) {
        this.addRouter("post", url, ...requestHandler);
    }
    put(url, ...requestHandler) {
        this.addRouter("put", url, ...requestHandler);
    }
    del(url, ...requestHandler) {
        this.addRouter("del", url, ...requestHandler);
    }
    addRouter(method, url, ...requestHandler) {
        this.restify[method](url, async (req, res, next) => {
            try {
                for (const rh of requestHandler) {
                    await rh(req, res, next);
                }
            }
            catch (err) {
                console.log(err);
                res.send(500, err);
            }
        });
        console.log(`Added route ${method.toUpperCase()}  ${url}`);
    }
    start(port) {
        dotenv.config({ path: ".env.example" });
        mongodb_1.DatabaseProvider.initConnection();
        this.restify = restify.createServer({
            name: "Restify Server",
            version: "1.0.0"
        });
        this.restify.use(restify.plugins.queryParser());
        this.restify.use(restify.plugins.bodyParser());
        this.restify.use(restify.pre.userAgentConnection());
        this.restify.use(restify.plugins.acceptParser(this.restify.acceptable));
        this.restify.use(restify.plugins.authorizationParser());
        this.restify.use(jwt({
            secret: process.env.JWT_SECRET,
            credentialsRequired: false,
            requestProperty: "auth",
            getToken: function fromHeaderOrQuerystring(req) {
                if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
                    return req.headers.authorization.split(" ")[1];
                }
                else if (req.query && req.query.token) {
                    return req.query.token;
                }
                return undefined;
            }
        })
            .unless({
            path: [
                /\/api-docs\//g,
                { url: "/", method: "OPTIONS" },
                /\/auth\//g
            ]
        }));
        /**
         * Add swagger endpoints
         */
        // const swaggerDocument = yaml.load("../../swagger.yaml");
        const swaggerDocument = require("../../swagger.json");
        const options = {
            explorer: true,
            baseURL: "api-docs"
        };
        this.restify.get("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));
        this.addControllers();
        this.restify.listen(port, () => console.log(`Server ${this.restify.name} is up & running on port ${port}`));
    }
    addControllers() {
        controllers_1.CONTROLLERS.forEach(controller => controller.initialize(this));
    }
}
exports.ApiServer = ApiServer;
//# sourceMappingURL=index.js.map