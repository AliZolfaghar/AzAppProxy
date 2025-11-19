import { Router } from "express";
const router = Router();
import { v4 as uuid } from 'uuid'
import db from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import tokenCache from "../tokenCache.js";

router.get('/login' , async  (req , res ) => {
    res.render('login')
    // insert sample data to database 
    
    // const { posts } = db.data

    // await db.update(({ posts }) => posts.push({ id : uuid() , title : 'foo' , body : 'bar' }))

    // posts.push().write();
    // TypeError: db.get is not a function

    // get data from database
    
    
})

router.post('/login' , (req , res ) => {
    const { email , password } = req.body;
    // get data from database
    // const {posts} = db.data

    // find user with email 
    const user = db.data.users.find((user) => user.email == email)
    if(!user){
        res.locals.email = email;
        return res.render('login' , { error : 'Username or Password is incorrect' , email })
    }

    // compare user password with password in database 
    if(!bcrypt.compareSync(password , user.password)){
        return res.render('login' , { error : 'Username or Password is incorrect' , email })
    }

    // create a jwt token and save in cookies 
    let token = jwt.sign({ email , name : user.name } , db.data.jwt_secret , { expiresIn : '1h' })
    res.cookie('loginToken' , token , { expires : new Date(Date.now() + 3600000) });

    // save token in node-cache 
    tokenCache.set(email , token);

    // redirect to /admin 
    res.redirect('/admin')
})

export default router;