import { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin from "../lib/checkLogin.js";

router.get('/help' , checkLogin , (req , res ) => {
    res.render('help')
})

export default router;