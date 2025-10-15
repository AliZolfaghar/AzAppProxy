// check to see if user in logged in or not , and redirect to login page if not logged in 
export default (req , res , next) => {
    if(!res.locals.currentUser){
        return res.redirect('/login')
    }
    console.log(res.locals.currentUser);
    next();
}