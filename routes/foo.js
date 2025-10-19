import { Router } from "express";
import flash from "../lib/flash.js";
import { setError , setMessage } from "../lib/flash.js"

const router = Router();




router.get('/foo' , (req , res ) => {

    flash.set('data1','asdasdasd')
    flash.set('data2', { a : 1 , b : 2 })
    // get all data in node-cache 
    let flash_data = flash.data
    res.render('foo' , {message : 'get' , flash_data })
})


router.post('/foo' , (req , res ) => {
    // res.render('foo' , {message : 'post'})
    // flash.set('message' , 'post');
    setError('error : la la la ') ; 
    setMessage('message : loo loo loo  ') ;
    res.redirect('/foo/bar');
})


router.get('/foo/bar' , (req , res ) => {
    res.render('foo' )
})



export default router;