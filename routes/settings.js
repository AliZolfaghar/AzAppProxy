import { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin from "../lib/checkLogin.js";

router.get('/admin/settings' , checkLogin , (req , res ) => {
    res.render('settings')
})



export default router;