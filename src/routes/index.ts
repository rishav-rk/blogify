import userAuth from "./user/auth.route.js"
import adminUserRoute from "./admin/user.route.js"
import userProfile from "./user/profile.route.js"
import postRoute from "./user/post.route.js"
import { Router } from "express"

const router = Router()

const defaultRoutes = [
    {
        path: "/auth",
        route: userAuth
    }, 
    {
        path: "/admin/user",
        route: adminUserRoute
    }, 
    {
        path: "/profile", 
        route: userProfile
    }, 
    {
        path: "/post", 
        route: postRoute
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

export default router