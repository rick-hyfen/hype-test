const {ChaincodeError, utils} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const CONSTANTS = require('./../common/constants');
const ERRORS = require('./../common/constants/errors');

const logger = utils.logger.getLogger('models/Participant');

class Participant {

    constructor({address, UID, _entitlements = 0.0, _pensionFund, _person}) {
        this.address = address;
        this.UID = UID;
        this.entitlements = _entitlements;
        this.pensionFund = _pensionFund;
        this.person = _person;
        this.status = 'ACTIVE';
    }

    addEntitlements(amount) {
        this.entitlements += amount;
        return this;
    }
    
    setInactive() {
        this.status = 'INACTIVE';
    }

    setTransferred() {
        this.status ='TRANSFERRED';
    }

    async save(txHelper) {
        await txHelper.putState(this.address, {
            'address': this.address,
            'UID': this.UID,
            'entitlement': this.entitlements,
            'pensionFund': this.pensionFund,
            'person': this.person,
            'status': this.status
        });

        return this;
    }
}

module.exports = Participant;