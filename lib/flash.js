import NodeCache from "node-cache";

const flash = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export default flash ;

// TODO :   in order to seperate each session message , we need to generate a session id for each user
//          and store messages in node-cache with session id as key


export const getFlash = ( req , res , next ) => {

    // get message and put in res.locals
    const message = flash.take('message');
    const error = flash.take('error');

    if(message){
        res.locals.message = message;
        res.locals.error = error;
        // flash.del('message');
    }
    next();
}

export const setMessage = (message) => {
    flash.set('message' , message);
} ; 
export const setError = (error) => {
    flash.set('error' , error);
} ;
