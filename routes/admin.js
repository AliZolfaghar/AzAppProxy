import { Router } from "express";
const router = Router();
import db from "../db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import checkLogin  from "../lib/checkLogin.js";

router.get('/admin' , checkLogin , (req , res ) => {
    // get users 
    const { users } = db.data

        
    const secret = db.data.jwt_secret

    res.render('admin/admin' , { users , secret})
})

export default router;