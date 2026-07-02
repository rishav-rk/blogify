import express from "express"
import router from "./routes/index.js"
import {errorhandler, routeNotFoundHandler} from "./middlewares/common.js"
import passport from "passport"
import JwtStrategy from "./config/passport.js"
import morganMiddleware from "./middlewares/morgan.js"

const app = express()

app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))

app.use(morganMiddleware)

// jwt authentication
app.use(passport.initialize())
passport.use(JwtStrategy);

app.get("/", (req:express.Request, res:express.Response) => {
    res.status(200).send("Hello World")
})

app.use('/api/v1', router);

app.use((req, res, next) => {
  routeNotFoundHandler(req, res, next);
});

app.use(errorhandler)

export default app