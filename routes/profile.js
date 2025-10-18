import { Router } from "express";
import checkLogin from "../lib/checkLogin.js";
import db from "../db.js";
import bcrypt from 'bcrypt';

const router = Router();

router.get('/admin/profile' , checkLogin , (req , res ) => {
    res.render('admin/profile' , { user : res.locals.currentUser });
})


// change password : admin/profile/changePassword 
router.post('/admin/profile/changePassword' , checkLogin , (req , res ) => {

    // get passwords from req.body
    const { currentPassword , newPassword , confirmPassword } = req.body;

    // passwords must post to this route 
    if(!currentPassword || !newPassword || !confirmPassword){
        return res.render('error' , { message : 'please fill all fields' , link : '/admin/profile'});
    }

    // compaire new password with confirm password 
    if(newPassword != confirmPassword){
        return res.render('error' , { message : 'new passwords does not match' , link : '/admin/profile'});
    }

    // get current user from database 
    const { users } = db.data
    const user = users.find((user) => user.email == res.locals.currentUser.email)
    if(!user){
        return res.render('error' , { message : 'user not found' , link : '/admin/profile'});
    }

    // compare current password with password in database 
    if(!bcrypt.compareSync(currentPassword , user.password)){
        return res.render('error' , { message : 'current password is incorrect' , link : '/admin/profile'});
    }

    // update password in database 
    user.password = bcrypt.hashSync(newPassword , 10);
    db.write();
    // db.update(({ users }) => users);



    res.render('admin/profile' , { user : res.locals.currentUser , message : 'password changed successfully' });
})



export default router;