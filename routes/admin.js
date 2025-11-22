import { Router } from "express";
const router = Router();
import db from "../db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import checkLogin  from "../lib/checkLogin.js";
import { resolve , extname} from "path";
import { readdirSync } from "fs";
import getPm2ListViaCLI from "../lib/pm2Process.js";
import { restartByPm2ID } from "../lib/pm2Process.js";

router.get('/admin' , checkLogin , async ( req , res ) => {
    // get users 
    const { users } = db.data

    // get proxies 
    const { proxies } = db.data

    // get ssl files 
    const sslDir = resolve('./ssl'); // resolves relative to project root
    const sslExtensions = ['.key', '.crt', '.pem', '.pfx'];
    const files =  readdirSync(sslDir);
    const sslFiles = files.filter(file => sslExtensions.includes(extname(file)));
        
    // get a list of pm2 services 
    let list = [{ name : '1' } , { name : '2' }];
    try {
        const data = await getPm2ListViaCLI();
        if(data.length > 0){
            list = data;
        }
    } catch (error) {
        console.log( 'error' , error.message);
    }

    res.render('admin/admin' , { users , proxies , sslFiles , list });
})


router.get('/admin/restartprocess/:pm2id' , async ( req , res ) => {
    const { pm2id } = req.params
    res.redirect('/admin');
    await restartByPm2ID(pm2id);
})

export default router;