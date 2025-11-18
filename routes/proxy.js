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

router.get('/admin/proxies' , checkLogin , (req , res ) => {
    // get all proxies from database 
    const { proxies } = db.data

    // get a list of available cert files in .ssl directory 
    const sslDir = resolve('./ssl'); // resolves relative to project root
    const sslExtensions = ['.key', '.crt', '.pem', '.pfx'];

    try {
        const files =  readdirSync(sslDir);
        const sslFiles = files.filter(file => sslExtensions.includes(extname(file)));
        res.render('admin/proxies' , { proxies , sslFiles})
    } catch (err) {
        // TODO : render error page 
        console.error('Error reading SSL directory:', err);
        res.render('admin/ssl' , { sslFiles : [] , error : 'Error reading SSL directory' })      
    }
})


// add proxy to database 
router.post('/admin/proxies/add' , checkLogin , async (req , res ) => {
    // get data from request
    // check for nessesary fields : public , local , key , cert
    // if(!req.body.public || !req.body.local || !req.body.key || !req.body.cert){
    if(!req.body.public || !req.body.local ){
        return res.render('error' , { message : 'please fill all fields : public , local , key , cert ' , link : '/admin/proxies'})
    }

    // if public is exists in proxies , return error 
    if(db.data.proxies.find( proxy => proxy.public === req.body.public)){
        return res.render('error' , { message : 'proxy already exists' , link : '/admin/proxies'})
    }

    const proxy = {
        "id" : uuid(),
        "public":req.body.public , 
        "local":req.body.local , 
        "options" : {
            "ssl": {
                "key"  : `./ssl/${req.body.key}`,
                "cert" : `./ssl/${req.body.cert}`,
                "ca"   : req.body.ca ? `./ssl/${req.body.ca}` : ''
            }
        }
    }; 

    // save to database 
    db.data.proxies.push(proxy);
    await db.write();
    restartProxy();
    res.redirect('/admin/proxies');
})



// delete handler
router.get('/admin/proxies/delete/:id' , checkLogin , (req , res ) => {
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
});

// edit proxy GET
router.get('/admin/proxies/edit/:id' , checkLogin , (req , res ) => {
    const { id } = req.params
    const { proxies } = db.data
    const proxy = proxies.find((proxy) => proxy.id == id)

    
    if(!proxy){
        return res.redirect('/admin/proxies')
    }

    // get ssl files
    const sslDir = resolve('./ssl');
    const sslExtensions = ['.key', '.crt', '.pem', '.pfx'];

    try {
        const files = readdirSync(sslDir);
        const sslFiles = files.filter(file => sslExtensions.includes(extname(file)));
        res.render('admin/editproxy' , { proxy , sslFiles })
    } catch (err) {
        console.error('Error reading SSL directory:', err);
        res.render('admin/editproxy' , { proxy , sslFiles : [] , error : 'Error reading SSL directory' })
    }
});

// edit proxy POST
router.post('/admin/proxies/edit/:id' , checkLogin , async (req , res ) => {
    const { id } = req.params
    const { proxies } = db.data
    const proxyIndex = proxies.findIndex((proxy) => proxy.id == id)
    if(proxyIndex === -1){
        return res.redirect('/admin/proxies')
    }

    if(!req.body.public || !req.body.local ){
        return res.render('error' , { message : 'please fill all fields : public , local' , link : '/admin/proxies'})
    }

    // if public is exists in proxies and not the same proxy, return error
    const existingProxy = proxies.find( proxy => proxy.public === req.body.public && proxy.id !== id);
    if(existingProxy){
        return res.render('error' , { message : 'proxy already exists' , link : '/admin/proxies'})
    }

    // update proxy
    proxies[proxyIndex] = {
        ...proxies[proxyIndex],
        "public":req.body.public ,
        "local":req.body.local ,
        "options" : {
            "ssl": {
                "key"  : req.body.key ? `./ssl/${req.body.key}` : '',
                "cert" : req.body.cert ? `./ssl/${req.body.cert}` : '',
                "ca"   : req.body.ca ? `./ssl/${req.body.ca}` : ''
            }
        }
    };

    await db.write();
    restartProxy();
    res.redirect('/admin/proxies');
});

export default router;