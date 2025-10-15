import { Router } from "express";
const router = Router();

router.get('/logout' , (req , res ) => {
    // remove token from cookies
    res.clearCookie('loginToken');
    res.redirect('/login')
})

export default router;