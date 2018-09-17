const {ChaincodeError, utils} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const CONSTANTS = require('./../common/constants');
const ERRORS = require('./../common/constants/errors');

const logger = utils.logger.getLogger('models/Participant');

class Person {

    constructor({address, _BSN, _name}) {
        this.address = address;
        this.BSN = _BSN;
        this.name = _name;
        this.participations = []
    }

    addParticipation(participant) {
        this.participations.push(participant);
    }  

    async save(txHelper) {
        await txHelper.putState(this.address, {
            'address': this.address,
            'BSN': this.BSN,
            'name': this.name,
            'participations': this.participations
        });

        return this;
    }
}

module.exports = Person;