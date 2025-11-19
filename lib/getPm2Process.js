import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * دریافت لیست PM2 با استفاده از دستور خط فرمان
 * @returns {Promise<Object>} اطلاعات برنامه‌ها در قالب JSON
 */
export async function getPm2ListViaCLI() {
    try {
        const { stdout } = await execPromise('pm2 jlist');
        const apps = JSON.parse(stdout);
        
        return apps;
    } catch (error) {
        // اگر jlist کار نکرد، از list معمولی استفاده کن
        try {
            const { stdout } = await execPromise('pm2 list --json');
            return JSON.parse(stdout);
        } catch (fallbackError) {
            throw new Error(`خطا در دریافت لیست PM2: ${fallbackError.message}`);
        }
    }
}

/**
 * نمایش برنامه‌های PM2 در کنسول
 * @returns {Promise<Array>} آرایه‌ای از برنامه‌ها
 */
export async function showPm2Apps() {
    try {
        const apps = await getPm2ListViaCLI();
        
        console.log('🚀 برنامه‌های در حال اجرا در PM2:');
        apps.forEach((app, index) => {
            const status = app.pm2_env.status === 'online' ? '✅' : '❌';
            console.log(`${status} ${index + 1}. ${app.name}`);
            console.log(`   PID: ${app.pid} | وضعیت: ${app.pm2_env.status}`);
            console.log(`   آدرس: ${app.pm2_env.PWD || 'نامشخص'}`);
            console.log('---');
        });
        
        return apps;
    } catch (error) {
        console.error('خطا:', error.message);
        throw error;
    }
}

// export پیش‌فرض
export default getPm2ListViaCLI;