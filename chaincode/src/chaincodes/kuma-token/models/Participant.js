const {ChaincodeError, utils} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const CONSTANTS = require('./../common/constants');
const ERRORS = require('./../common/constants/errors');

const logger = utils.logger.getLogger('models/Participant');

class Participant {

    constructor({address, UID, _entitlements = 0.0, _pensionFund}) {
        this.address = address;
        this.UID = UID;
        this.entitlements = _entitlements;
        this.pensionFund = _pensionFund;
        this.status = 'ACTIVE';
    }

    addAmount(amount) {
        this.entitlements += amount;
        return this;
    }

    deactivateParticipant() {
        this.status = 'INACTIVE';
    }

    closeParticipant() {
        this.status ='DONE';
    }

    async save(txHelper) {
        await txHelper.putState(this.address, {
            'address': this.address,
            'name': this.name,
            'amount': this.amount
        });

        return this;
    }
}

module.exports = PensionFund;