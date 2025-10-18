import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import express from 'express';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sslDir = path.join(__dirname, '../ssl');

await fs.mkdir(sslDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, sslDir),
  filename: async (req, file, cb) => {
    const filePath = path.join(sslDir, file.originalname);
    try {
        await fs.access(filePath);
        // cb(new Error(`فایل ${file.originalname} قبلاً وجود دارد.`));
        // in english : 
        cb(new Error(`The file ${file.originalname} already exists.`));
        // cb(new Error(`فایل ${file.originalname} قبلاً وجود دارد.`));
    } catch {
        cb(null, file.originalname);
    }
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const sslFields = upload.fields([
  { name: 'cert', maxCount: 1 },
  { name: 'key', maxCount: 1 },
  { name: 'ca', maxCount: 1 }
]);

router.post('/admin/ssl/upload', async (req, res) => {

    sslFields(req, res, async (err) => {
        if (err) {
            res.render('error', { message : err.message , link : '/admin/ssl'})
        } else {
            res.redirect('/admin/ssl');
        }
    });
    // try {
    //     await sslFields(req, res  );
    //         res.render('admin/ssl', {
    //             success: '✅ فایل‌ها با موفقیت آپلود شدند.'
    //         });
    // } catch (error) {
    //     res.status(400).render('error', {
    //     error: err.message,
    //     backLink: '/admin/ssl'
    //     });
                
    // }




    // res.status(200).send('✅ فایل‌ها با موفقیت آپلود شدند.');
  // res.redirect('/admin/ssl');
//   res.status(200).render('admin/ssl', {
//     success: '✅ فایل‌ها با موفقیت آپلود شدند.'
//   });  

});


export default router;
