'use strict';

var aws = require('aws-sdk');
var ec2 = new aws.EC2({ apiVersion: '2016-09-15' });

var pub = {};

pub.validate = function (event) {
    if (!event.ResourceProperties.IPAddress) {
        throw new Error('Missing required property IPAddress');
    }
};

pub.create = function (event, _context, callback) {
    var ipAddress =  event.ResourceProperties.IPAddress;
    delete event.ResourceProperties.ServiceToken;
    delete event.ResourceProperties.IPAddress;
    var params = event.ResourceProperties;
    ec2.describeAddresses(params, function (error, response) {
        if (error) {
            return callback(error);
        }

        var address;
        for (var i = 0; i < response.Addresses.length; i++) {
            if (response.Addresses[i].PublicIp === ipAddress) {
                address = response.Addresses[i];
                break;
            }
        }
        if (!address) {
            return callback(new Error('IP address not found'));
        }
        var data = address;
        data.physicalResourceId = address.PublicIp;
        callback(null, data);
    });
};

pub.update = function (event, context, callback) {
    return pub.create(event, context, callback);
};

pub.delete = function (_event, _context, callback) {
    setImmediate(callback);
};

module.exports = pub;
