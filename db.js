import crypto from 'crypto';
import { JSONFilePreset, JSONFileSyncPreset } from 'lowdb/node'

const secret = crypto.randomBytes(20).toString('hex');

const defaultData = { posts: [] , users : [] , proxies : []  , jwt_secret : secret };
const db = JSONFileSyncPreset('./db/db.json', defaultData)

export default db