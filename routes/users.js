import { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin  from "../lib/checkLogin.js";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

router.get('/admin/users' , checkLogin , (req , res ) => {
    // get all users
    const { users } = db.data

    res.render('admin/users' , { users })
})



router.get('/admin/users/add' , checkLogin , (req , res ) => {
    const user = { name : ''  , email : ''  , password : '' }
    res.render('admin/addEditUser' , { user  , mode : 'add' , add : true })
})

router.post('/admin/users/add' , checkLogin , (req , res ) => {
    let { name , email , password } = req.body;
    // hash password 
    password = bcrypt.hashSync(password , 10);
    // save in database 
    const { users } = db.data
    db.update(({ users }) => users.push({ id : uuid() , email , password , name }))
    // res.render('admin/addEditUser' , { user  , mode : 'add' })
    res.redirect('/admin/users');
})







router.get('/admin/users/edit/:id' , checkLogin , (req , res ) => {
    // find user by id 
    const { id } = req.params
    const { users } = db.data
    const user = users.find((user) => user.id == id)
    if(!user){
        return res.redirect('/admin/users')
    }

    res.render('admin/addEditUser' , { user , mode : 'edit' , edit : true }  );
})

router.post('/admin/users/edit/:id' , checkLogin , (req , res ) => {
    // find user by id 
    const { id } = req.params
    let { name , email , password } = req.body;
    // hash password 
    if(password){
        password = bcrypt.hashSync(password , 10);
    }
    // save in database 
    const { users } = db.data
    const user = users.find((user) => user.id == id)
    if(!user){
        return res.redirect('/admin/users')
    }
    // user.email = email;
    if(password){
        user.password = password;
    }
    user.name = name;
    db.update(({ users }) => users)

    res.redirect('/admin/users');
});



// get delete 
router.get('/admin/users/delete/:id' , checkLogin , (req , res ) => {
    // find user by id 
    const { id } = req.params
    const { users } = db.data
    const user = users.find((user) => user.id == id)
    if(!user){
        return res.redirect('/admin/users')
    }
    // remove user from database 
    // db.update(({ users }) => users.splice(users.indexOf(user) , 1))
    res.render('admin/addEditUser' , { user  , mode : 'delete' , delete : true }  );
});

// delete 
router.post('/admin/users/delete/:id' , checkLogin , (req , res ) => {
    // find user by id 
    const { id } = req.params
    const { users } = db.data
    const user = users.find((user) => user.id == id)
    if(!user){
        return res.redirect('/admin/users')
    }

    // do not delete if user is equal to current user 
    if(user.email == res.locals.currentUser.email){
        // return res.redirect('/admin/users')
        res.render('admin/addEditUser' , { user  , mode : 'delete' , delete : true , error : 'You can not delete yourself' }  );
    }else{
        // remove user from database 
        db.update(({ users }) => users.splice(users.indexOf(user) , 1))
        res.redirect('/admin/users');
    }

});





export default router;