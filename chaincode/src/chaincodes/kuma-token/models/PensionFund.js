const {ChaincodeError, utils} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const CONSTANTS = require('./../common/constants');
const ERRORS = require('./../common/constants/errors');

const logger = utils.logger.getLogger('models/PensionFund');

class PensionFund {

    constructor({address, name}) {
        this.address = address;
        this.name = name;
        this.participants = [];
    }

    addParticipant(participant) {
        this.participants.push(participant);    
    }

    async save(txHelper) {
        await txHelper.putState(this.address, {
            'address': this.address,
            'name': this.name,
            'participants': this.participants
        });

        return this;
    }
}

module.exports = PensionFund;