// create initial user for admin 
import { Router } from "express";
const router = Router();
import db from "../db.js";

router.get('/setup' , (req , res ) => {
    // get users 
    const { users } = db.data
    if(users.length > 0){
        return res.redirect('/admin')
    }
    
    res.render('setup' , { users })
})

router.post('/setup' , (req , res ) => {
    const { name , email , password } = req.body;
    // create user 
    const { users } = db.data
    db.update(({ users }) => users.push({ email , password }))
    res.redirect('/admin')
})

export default router;