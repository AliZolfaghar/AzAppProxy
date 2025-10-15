import app from './app.js';
import Redbird from "@jchip/redbird";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json'));

const proxy = new Redbird({
    port: 80 , 
    xfwd : true ,  // pass client ip address 
    cluster : 1 ,  // cluster proxy on 1 cpu core 
    ssl:{
        port : 443 , 
        "key"  : "./ssl/ipo.org.key.pem",
        "cert" : "./ssl/ipo.org.cert.pem",
        // "ca"   : "./ssl/RootCA.crt"
    },
    logger : true 
}); 


// redirect /admin to localhost/admin
// proxy.redirect( '/admin' , 'http://localhost/admin' );

proxy.notFound( (req , res) => {
    return app(req , res); 
    
    console.log('NOTFOUND ! request :' , req.method , req.url );     
    // console.log('headers :' , req.headers)

    // if a none registered proxy call like https://abc.akomsn.cf/update , proxy will trigger self update from git repo 
    if(req.url=='/update'){ 
        // TODO : add some authentication via headers to handle update requests 
        update();
        res.write('check and auto update');
        res.end(); 
    }
    else if (req.url == '/admin'){
        // pass control to express 
        app(req , res);
        // res.write('foo')
        // res.end()

    }
    else{
        var links = '<ul>';
        config.sites.map( i=> {
            links += `<li><a href="https://${i.public}">${i.public}</a></li>`;
        })
        links += '</ul>';

        res.statusCode = 404;
        res.write(`
        <!DOCTYPE html>
        <html lang="en">    
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error - Page Not Found</title>
            <style>body{padding-top:25vh;background:#39323217}.container{display:flex;flex-direction:column;margin:auto;width:70vw;padding:10px;align-items:center}h1{font-size:100px;font-weight:900;margin-top:5px;margin-bottom:10px;color:#2723238a;user-select:none;font-family:'Press Start 2P',cursive}h2{font-size:40px;font-family:'Press Start 2P',cursive;margin-bottom:10px;margin-top:0;color:#9d9191;text-align:center;user-select:none}h2:last-child{font-size:30px}a{text-decoration: none;color: gray;font-family: tahoma;line-height: 1.5;font-size: 18px;}</style>
        </head>
        <body>
            <div class="container">
                <h2>ERROR</h2>
                <h1>404</h1>
                <h2>PAGE NOT FOUND</h2>
                ${links}
                </div>
        </body>    
        </html>    
        `);

        res.end();
    }
});


// register proxies
config.sites.map( site => {    
    console.log('register site' ,site.public)
    // if you use a *.domain.com ssl , just use {ssl:true} to register the apps in proxy 
    // if not , use each app ssl from config.sites.options
    // proxy.register( site.public , site.local , {ssl: true}); for *.Domain SSL 
    proxy.register( site.public , site.local , site.options);
});
