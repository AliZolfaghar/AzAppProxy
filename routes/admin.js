import { Router } from "express";
const router = Router();
import db from "../db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import checkLogin  from "../lib/checkLogin.js";
import { resolve , extname} from "path";
import { readdirSync } from "fs";

router.get('/admin' , checkLogin , (req , res ) => {
    // get users 
    const { users } = db.data

    // get proxies 
    const { proxies } = db.data

    // get ssl files 
    const sslDir = resolve('./ssl'); // resolves relative to project root
    const sslExtensions = ['.key', '.crt', '.pem', '.pfx'];
    const files =  readdirSync(sslDir);
    const sslFiles = files.filter(file => sslExtensions.includes(extname(file)));
        

    res.render('admin/admin' , { users , proxies , sslFiles})
})

export default router;