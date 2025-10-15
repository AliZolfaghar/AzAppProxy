import { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin from "../lib/checkLogin.js";

router.get('/' , checkLogin , (req , res ) => {
    res.redirect('/admin')
})

export default router;