import { Router } from "express";
import checkLogin from "../lib/checkLogin.js";
const router = Router();

router.get('/admin/profile' , checkLogin , (req , res ) => {
    res.render('admin/profile');
})

export default router;