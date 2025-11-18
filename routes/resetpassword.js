import { Router } from "express";
const router = Router();

import db from "../db.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emailaddress',
    pass: 'gmail app-password'
  }
});

async function sendEmail( to , subject , text , html ) {
  try {
    const info = await transporter.sendMail({
      from: '"name" <emailaddress>',
      to: to,
      subject: subject ,
      text: text,
      html: html
    });
    
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}






router.get('/resetpassword' , (req , res ) => {
    res.render('resetpassword');
})


router.post('/resetpassword' , (req , res ) => {
    let { email } = req.body;

    // if email is not a valid email , show an erro 
    if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
        return res.render('resetpassword' , { error : 'invalid email address !' , email });
    }

    // check if email exist in database 
    const { users } = db.data
    const user = users.find((user) => user.email == email)
    if(!user){
        return res.render('resetpassword' , { error : 'email not found !' , email });
    }

    // create a random password and save in database 
    const password = Math.random().toString(36).slice(2);
    user.password = bcrypt.hashSync(password , 10);
;
    db.write();

    // send email to user with new password 
    sendEmail( email , 'your new password' , 'your new password is : ' + password , 'your new password is : ' + password );

    res.render('resetpassword' , { message : 'please check your email !' , email  });
})





export default router;