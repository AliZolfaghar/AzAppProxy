import { Router } from "express";
const router = Router();

router.get('/about' , (req , res ) => {
    res.render('about')
})

export default router;