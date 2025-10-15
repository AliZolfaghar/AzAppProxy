import { Router } from "express";
const router = Router();
import { v4 as uuid } from 'uuid'
import db from "../db.js";

router.get('/admin/login' , async  (req , res ) => {
    res.render('admin/login')
    // insert sample data to database 
    
    const { posts } = db.data

    await db.update(({ posts }) => posts.push({ id : uuid() , title : 'foo' , body : 'bar' }))

    // posts.push().write();
    // TypeError: db.get is not a function

    // get data from database
    
    
})

router.post('/admin/login' , (req , res ) => {
    const { email , password } = req.body;
    // get data from database
    const {posts} = db.data

    res.json({ email , password , posts })    
})

export default router;