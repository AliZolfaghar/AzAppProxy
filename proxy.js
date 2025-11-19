import app from './app.js';
import Redbird from "@jchip/redbird";
import fs from 'fs';
import db from './db.js';

// const config = JSON.parse(fs.readFileSync('./config.json'));

const proxy = new Redbird({
    port: 80 , 
    xfwd : true ,  // pass client ip address 
    cluster : 1 ,  // cluster proxy on 1 cpu core 
    // ssl:{
        // port : 443 , 
        // "key"  : "./ssl/ipo.org.key.pem",
        // "cert" : "./ssl/ipo.org.cert.pem",
        // "ca"   : "./ssl/RootCA.crt"
    // },
    // bunyan : { level : 'error'} , 
    
}); 

// redirect /admin to localhost/admin
// proxy.redirect( '/admin' , 'http://localhost/admin' );

proxy.notFound( (req , res) => {
    return app(req , res);     
});


export function startProxy() {
    // get proxy ist from database 
    const { proxies } = db.data
    proxies.map( site => {    
        console.log('register site' ,site.public)
        // if you use a *.domain.com ssl , just use {ssl:true} to register the apps in proxy 
        // if not , use each app ssl from config.sites.options
        // proxy.register( site.public , site.local , {ssl: true}); for *.Domain SSL 
        try {
            proxy.register( site.public , site.local , site.options);
        } catch (error) {
            console.log(error.message)            
        }
    });
}

// start proxy 
startProxy();

export function stopProxy() {
  if (proxy && proxy.close) {
    proxy.close(() => {
      console.log('Proxy stopped');
    });
  }
}


export function restartProxy() {
  stopProxy();
  setTimeout(() => {
    startProxy();
  }, 500); // کمی تأخیر برای اطمینان از بسته شدن کامل
}
