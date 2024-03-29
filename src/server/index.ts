import { HttpServer } from "./httpServer";
import { Request, RequestHandler, Server, RequestHandlerType } from "restify";
import * as restify from "restify";
import { CONTROLLERS } from "../controllers";
import * as jwt from "restify-jwt-community";
import * as dotenv from "dotenv";
import { DatabaseProvider } from "../database/mongodb";
import * as swaggerUI from "swagger-ui-restify";
import * as yaml from "yamljs";
import * as logger from "bunyan";



export class ApiServer implements HttpServer {
    private restify: Server;

    get(url: string, ...requestHandler: RequestHandler[]): void {
        this.addRouter("get", url, ...requestHandler);
    }

    post(url: string, ...requestHandler: RequestHandler[]): void {
        this.addRouter("post", url, ...requestHandler);
    }

    put(url: string, ...requestHandler: RequestHandler[]): void {
        this.addRouter("put", url, ...requestHandler);
    }

    del(url: string, ...requestHandler: RequestHandler[]): void {
        this.addRouter("del", url, ...requestHandler);
    }

    private addRouter(method: "get" | "post" | "put" | "del", url: string, ...requestHandler: RequestHandler[]): void {

        const requestHandlerList: RequestHandler[] = [];
        for ( const rh of requestHandler) {
            requestHandlerList.push( async (req, res, next) => {
                try {
                    await rh(req, res, next);
                } catch (err) {
                    console.log(err);
                    res.send(500, err);
                }
            });
        }
        this.restify[method](url, requestHandlerList);
        console.log(`Added route ${method.toUpperCase()}  ${url}`);
    }

    public start(port: number): void {
        dotenv.config({path: ".env.example"});
        DatabaseProvider.initConnection();
        const log = logger.createLogger({name: "restify logger"});
        this.restify = restify.createServer({
            name: "Restify Server",
            version: "1.0.0",
            log: log
        });
        // this.restify.pre((req, res, next) => {
        //     this.restify.log.info({ req: req}, `no req.log in "pre" handler`);
        //     next();
        // });
        // this.restify.use((req, res, next) => {
        //     req.log.info(`have ${req.id} and ${req.url} felds in route Handler`);
        //     next();
        // });
        this.restify.use(restify.plugins.queryParser());
        this.restify.use(restify.plugins.bodyParser());
        this.restify.use(restify.pre.userAgentConnection());
        this.restify.use(restify.plugins.acceptParser(this.restify.acceptable));
        this.restify.use(restify.plugins.authorizationParser());
        this.restify.use(jwt({
            secret: process.env.JWT_SECRET,
            credentialsRequired: false,
            requestProperty: "auth",
            getToken: function fromHeaderOrQuerystring(req: Request) {
                if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
                    return req.headers.authorization.split(" ")[1];
                } else if (req.query && req.query.token) {
                    return req.query.token;
                }
                return undefined;
            }
        })
            .unless({
                path: [
                    /\/api-docs\//g,
                    {url: "/", method: "OPTIONS"},
                    /\/auth\//g
                ]})
        );

        // TODO: some problems with restify swagger
        /**
         * Add swagger endpoints
         */
        // const swaggerDocument = yaml.load("../../swagger.yaml");
        // const options = {
        //     explorer: true,
        //     baseURL: "api-docs"
        // };
        // this.restify.get("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));


        this.addControllers();
        this.restify.listen(port, () => console.log(`Server ${this.restify.name} is up & running on port ${port}`));
    }



    private addControllers(): void {
        CONTROLLERS.forEach(controller => controller.initialize(this));
    }
}