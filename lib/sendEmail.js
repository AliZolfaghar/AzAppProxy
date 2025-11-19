import nodemailer from "nodemailer";
import db from "../db.js";

const  sendMail = async ( to , subject , message) => {

    // log data 
    console.log(to)
    console.log(subject)
    console.log(message)

    // get mail config from database 
    const { settings } = db.data
    if(!settings){
        throw new Error('email settings not found !!!')
    }

    const from = settings.email 
    const password  = settings.password

    // validate to address and throw error 
    if(!to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
        throw new Error('invalid email address !')
    }

     
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: from,
        pass: password,
      },
    });
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: message,
      html: message,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    transporter.close();

    // if info show success email send return info , else throw error
    if(!info){
        throw new Error('email not sent !')
    }else{
        return info
    }

  };


  export default sendMail;