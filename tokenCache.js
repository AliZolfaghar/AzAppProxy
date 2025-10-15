import NodeCache from "node-cache";
const tokenCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
export default tokenCache;