import { Router } from "express";
const router = Router();
import db from "../db.js";
import checkLogin from "../lib/checkLogin.js";
import { extname, resolve } from 'path';
import { readdirSync } from "fs";
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { restartProxy } from "../proxy.js";

const add = async () => {
    const sample = {
        "public":"st.ipo.ir" , 
        "local":"http://192.168.4.70:81" , 
        "options" : {
            "ssl": {
                "key"  : "./ssl/ipo.ir.key.pem",
                "cert" : "./ssl/ipo.ir.cert.pem",
                "ca"   : ""
            }
        }
    }; 

    db.data.proxies.push(sample);
    await db.write();
}

// get all proxies and render add / edit proxy page
router.get('/admin/proxies{/:id}' , checkLogin , (req , res ) => {
    // get a list of available cert files in .ssl directory 
    const sslDir = resolve('./ssl'); // resolves relative to project root
    const sslExtensions = ['.key', '.crt', '.pem', '.pfx'];

    try {
        const files =  readdirSync(sslDir);
        const sslFiles = files.filter(file => sslExtensions.includes(extname(file)));
        const { proxies } = db.data
        // get proxy by id
        const proxy = db.data.proxies.find( proxy => proxy.id === req.params.id)

        if(proxy){
            // render edit proxy page
            res.render('admin/proxies' , { proxies , sslFiles , id : req.params.id , public : proxy.public , local : proxy.local , key : proxy.options.ssl.key , cert : proxy.options.ssl.cert , ca : proxy.options.ssl.ca  })
        }else{
            // render add proxy page
            res.render('admin/proxies' , { proxies , sslFiles })
        }
    } catch (err) {
        // TODO : render error page 
        console.error('Error reading SSL directory:', err);
        res.render('admin/ssl' , { sslFiles : [] , error : 'Error reading SSL directory' })      
    }
})


const insertProxy = async ( req , res ) => {
    const proxy = {
        "id" : uuid(),
        "public":req.body.public , 
        "local":req.body.local , 
        "options" : {
            "ssl": {
                "key"  : req.body.key  ? `./ssl/${req.body.key}`  : '',
                "cert" : req.body.cert ? `./ssl/${req.body.cert}` : '',
                "ca"   : req.body.ca   ? `./ssl/${req.body.ca}`   : ''
            }
        }
    }; 

    // save to database 
    db.data.proxies.push(proxy);
    await db.write();
    restartProxy();
    res.redirect('/admin/proxies');
};

const updateProxy = async ( req , res ) => {
    const proxy = {
        "id" : req.params.id,
        "public":req.body.public , 
        "local":req.body.local , 
        "options" : {
            "ssl": {
                "key"  : req.body.key  ? `./ssl/${req.body.key}`  : '',
                "cert" : req.body.cert ? `./ssl/${req.body.cert}` : '',
                "ca"   : req.body.ca   ? `./ssl/${req.body.ca}`   : ''
            }
        }
    }; 

    // update proxy in database 
    const { proxies } = db.data
    const index = proxies.findIndex( proxy => proxy.id === req.params.id);
    proxies[index] = proxy;
    await db.write();
    restartProxy();
    res.redirect('/admin/proxies');    
};


const deleteProxy = async ( req , res ) => {
    // find user by id
    const { id } = req.params
    const { proxies } = db.data
    const proxy = proxies.find((proxy) => proxy.id == id)
    if(!proxy){
        return res.redirect('/admin/proxies')
    }
    // remove user from database
    db.update(({ proxies }) => proxies.splice(proxies.indexOf(proxy) , 1))
    restartProxy();
    res.redirect('/admin/proxies');
};


// post method to insert or update the proxy 
router.post('/admin/proxies{/:id}' , checkLogin , async (req , res ) => {
    if(req.params.id){
        updateProxy(req , res);
    }else{
        insertProxy(req , res);
    }
});


// delete handler
router.get('/admin/proxies/delete/:id' , checkLogin , (req , res ) => {
    deleteProxy(req , res);
});


export default router;