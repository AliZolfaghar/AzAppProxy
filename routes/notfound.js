import { Router } from "express";
const router = Router();

router.get('/notfound' , (req , res ) => {
    res.json({ foo : 'bar123'})
})

export default router;