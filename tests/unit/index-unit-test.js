'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var describeAddressesStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            EC2: function () {
                this.describeAddresses = describeAddressesStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        describeAddressesStub.reset().resetBehavior();
        describeAddressesStub.yields(undefined, { Addresses: [
            { PublicIp: '123.456.789.0', AssociationId: 'AssociationId' },
            { PublicIp: 'IPAddress', AssociationId: 'AssociationId' }
        ]});

        event = {
            ResourceProperties: {
                IPAddress: 'IPAddress'
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if IPAddress is not set', function (done) {
            delete event.ResourceProperties.IPAddress;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property IPAddress/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(describeAddressesStub.calledOnce).to.equal(true);
                expect(response.physicalResourceId).to.equal('IPAddress');
                expect(response.AssociationId).to.equal('AssociationId');
                done();
            });
        });
        it('should fail due to describeAddresses error', function (done) {
            describeAddressesStub.yields('describeAddresses');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('describeAddresses');
                expect(describeAddressesStub.calledOnce).to.equal(true);
                expect(response).to.equal(undefined);
                done();
            });
        });
        it('should fail due to no matching address', function (done) {
            describeAddressesStub.yields(null, { Addresses: [] });
            subject.create(event, {}, function (error, response) {
                expect(error.message).to.equal('IP address not found');
                expect(describeAddressesStub.calledOnce).to.equal(true);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });

    describe('update', function () {
        it('should succeed', function (done) {
            subject.update(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(describeAddressesStub.calledOnce).to.equal(true);
                expect(response.physicalResourceId).to.equal('IPAddress');
                expect(response.AssociationId).to.equal('AssociationId');
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(describeAddressesStub.called).to.equal(false);
                done();
            });
        });
    });
});
