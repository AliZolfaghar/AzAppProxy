import { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin from "../lib/checkLogin.js";
import { readdir } from 'fs/promises';
import { extname, resolve } from 'path';
import { readdirSync } from "fs";

router.get('/admin/ssl' , checkLogin , (req , res ) => {
    // get a list of all ssl files from /ssl folder 


    const sslDir = resolve('./ssl'); // resolves relative to project root
    const sslExtensions = ['.key', '.crt', '.pem', '.pfx'];

    try {
        const files =  readdirSync(sslDir);
        const sslFiles = files.filter(file => sslExtensions.includes(extname(file)));
        console.log('SSL files:', sslFiles);
        res.render('admin/ssl' , { sslFiles })
    } catch (err) {
        console.error('Error reading SSL directory:', err);
        res.render('admin/ssl' , { sslFiles : [] , error : 'Error reading SSL directory' })
        
    }

})

export default router;