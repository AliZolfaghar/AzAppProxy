import path from 'path';
import { readdir, readdirSync } from 'fs'; 
import express from 'express';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import db from './db.js'; 
// import handlebarHelpers from './shared/handlebarHelpers.js';

const  app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static("./www")); // server files in /www as static html files

// setup handlebars 
app.engine('handlebars', engine({    
    // defaultLayout: 'main' , 
    // helpers : handlebarHelpers
}));



// set res.locals , 
// res.locals objects will automatically pass to handlebars 
// and accessable in handlebars with object names without res.locals ( ex : res.locals.user => user )
app.use((req, res, next) => {
    // check to is any user exists in database or not 
    const {users} = db.data ; 
    if(users.length == 0 && req.path !== '/setup'){ 
        return res.redirect('/setup');
    }


    console.log(`PROCESS : [${req.ip}] [${req.method}] ${req.url}`);
    if(req.path.startsWith('/admin')) res.locals.showAdminMenu = true ; // set showAdminMenu = true to render admin menu in handlbars 
    res.locals.path = req.originalUrl;
    res.locals.test = 'this is a test value in res.locals '; // 
    res.locals.version = 1// config.VERSION;        
    next();
});

app.set('view engine', 'handlebars');
app.disable('view cache');


// load routes from apiRoutre folder dynamically 
const loadApiRoutesAndStart = async () => {
    const routesPath = path.resolve("routes");
    const routeFiles = readdirSync(routesPath, { recursive: true });
    
    for ( const file of routeFiles ) {
        if (file.endsWith(".js")) {
            const routerFile = "./routes/" + file.replaceAll("\\", "/");
            console.log( `Register Router File : ${routerFile}`);
            const { default: route } = await import(routerFile);
            app.use(route);
        }
    }    

    // trap 404 errors
    app.use((req, res) => {
        // res.status(404).send({ error: "route not found", detail: `${req.url} not found` });
        res.redirect('/notfound')
    })
    
    // listen to requests via express-app
    app.listen('81', () => {
        console.log(`express listen on port : 81`);
    });
};

loadApiRoutesAndStart();

export default app 