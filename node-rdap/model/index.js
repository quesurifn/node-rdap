module.exports = {
    // @type (string): asn || v6 || v4
    queryCache: async function(start, end, type = 'v4', options = {}) {
        const db = client.db(options.cacheDb);
        const collection = db.collection('cache');
        const query = {$gte: start, $lte: end, type}
        await collection.findOne(query);
    },
    updateCache: async function () {
        
    }
}