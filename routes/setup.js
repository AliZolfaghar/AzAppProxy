// create initial user for admin 
import { Router } from "express";
const router = Router();
import db from "../db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

router.get('/setup' , (req , res ) => {
    // get users 
    const { users } = db.data
    if(users.length > 0){
        return res.redirect('/admin')
    }
    
    res.render('setup' , { users })
})

router.post('/setup' , async ( req , res ) => {
    let { name , email , password } = req.body;
    password = bcrypt.hashSync(password , 10);

    // create user 
    const { users } = db.data
    db.update(({ users }) => users.push({ id : uuid() , email , password , name }))

    // add jwt_secret to database
    const secret = crypto.randomBytes(64).toString('hex');
    const { jwt_secret } = db.data
    db.jwt_secret = secret;
    db.write();

    res.redirect('/admin')
})

export default router;