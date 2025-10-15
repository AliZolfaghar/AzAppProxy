import { Router } from "express";
const router = Router();
import db from "../db.js";

router.get('/admin' , (req , res ) => {
    // get users 
    const { users } = db.data

    res.render('admin/admin' , { users })
})

export default router;