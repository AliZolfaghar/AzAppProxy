import e, { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin from "../lib/checkLogin.js";
import sendEmail from "../lib/sendEmail.js";

// render setting page 
router.get('/admin/settings' , checkLogin , ( req , res ) => {
    // get settings from database
    const { settings } = db.data
    res.render('admin/settings' , { email : settings?.email , password : settings?.password });
})


// save or update settings 
router.post('/admin/settings' , checkLogin,  ( req , res ) => {
    console.log(req.body)
    // get email and password from req.body 
    let { email , password } = req.body;
    // hash password 
    
    // save in database 
    const { settings } = db.data
    if(!settings){
        db.data.settings = { email , password }
    }
    else{
        // update settings in database
        settings.email = email;
        settings.password = password;
    }
    db.write();
    res.render('admin/settings' , { email : settings.email , password : settings.password  , message : 'Settings updated successfully' });
    // res.redirect('/admin/settings' , { settings  , message : 'Settings updated successfully' });
})




router.get('/admin/settings/testemail' , checkLogin , ( req , res ) => {
    // get email and password from db 
    const { settings } = db.data
    if(settings){
        res.render('admin/testmail' , { emailTo : settings.email , subject : 'Test Email' , messageBody : 'This is a test Email' });
    }else{
        res.render('admin/testmail' , { hideButton : true , emailTo : '' , subject : 'Test Email' , messageBody : 'This is a test Email' , error:'email settings not found' });
    }

    // res.render('admin/testmail' , { emailTo : '' , subject : 'Test Email' , messageBody : 'This is a test Email' });
})

// pos route to test email 
router.post('/admin/settings/testemail' , checkLogin , async ( req , res ) => {
    console.log(req.body)
    // get email and password from req.body 
    let { emailTo , subject , messageBody } = req.body;
    
    
    try {        
        await sendEmail( emailTo , subject , messageBody);
        // render with success message
        res.render('admin/testmail' , { emailTo , subject , messageBody , message : 'Email sent successfully' });
    } catch (error) {
        // render with error 
        console.log(error)
        res.render('admin/testmail' , { emailTo ,subject , messageBody , error : error.message });
    }
})


export default router;