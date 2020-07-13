const {isIp, isAsn, queryIANA} = require('./utils/index')
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017';

module.exports = {
    query: async function (query, cache = false) {
        let client = false;
        if(typeof query !== 'string') {
            throw('Query must be a string.');
        }
        if(cache && typeof cache !== 'string') {
            throw('Cache name must be a string');
        }
        try {
            client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
        } catch (e) {
            console.info("Cache doesn't exist because there is no active MongoDB connection")
        }

        const ip = isIp(query);
        const asn = isAsn(query);
        if(!ip && !asn) {
            throw('Query type is not supported');
        }
        const type = ip || "asn";
        if(client) {

        } else {
            const rdapUrl = await queryIANA(type, query);
            
        }
    },
    updateCache: async function() {

    }
}