const isIp = require('is-ip');
const got = require('got');
const {ianaUrls} = require('../constants/index');
const Cidr = require('ip-cidr');
const {queryCache} = require('../model/index');
module.exports = {
    isIp: function (ip) {
        let isip = isIp(ip);
        if (isip) {
            const type = isIp.version(ip);
            isip = `v${type}`;
        }

        return isip;
    },
    isAsn: function(asn) {
        return asn.toLowerCase().includes("AS");
    },
    queryIANA: async function(type, string) {
        const url = this.findIanaUrlFromType(type);
        const response = await got(url).json();
        return this.findResponseMatch(response, type, string);
    },
    queryMongo: async function(type, string) {

    },
    queryRdap: async function (type, string) {

    },
    findIanaUrlFromType: function(type) {
        for (let block in ianaUrls) {
            if(block.type === type) {
                return block.url;
            }
        }
    },
    findResponseMatch: function(response, type, subject) {
        for (let index = 0; index < response.services.length; index++) {
            const element = response.services[index];
            const ranges = element[0];
            const urls  = element[1];
            const https = urls.filter(e => e.includes("https"))[0];
            for (let i = 0; index < ranges.length; i++) {

                if(type !== 'asn') {

                    const cidr = new Cidr(ranges[i])
                    if(cidr.contains(subject)) {
                        return https;
                    }

                } else {

                    const range = ranges[i].trim().split("-").map(asn => parseInt(asn, 10)).sort((a,b) => a-b);
                    const parsedAsn = parseInt( subject.replace(/AS/i, ""), 10 );
                    if(parsedAsn >= range[0] && parsedAsn <= range[1]) {
                        return https;
                    }

                }
            }
        }
        // Default to RIPE
        return "https://rest.db.ripe.net/";
    }
}