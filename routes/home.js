import { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin from "../lib/checkLogin.js";

import getPm2ListViaCLI from "../lib/getPm2Process.js";

router.get('/' , checkLogin , async ( req , res ) => {
    res.redirect('/admin');
})

export default router;