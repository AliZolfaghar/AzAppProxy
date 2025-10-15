import { JSONFilePreset, JSONFileSyncPreset } from 'lowdb/node'
const defaultData = { posts: [] , users : [] , proxies : [] }
const db = JSONFileSyncPreset('./db/db.json', defaultData)

export default db