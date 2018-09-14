const {ChaincodeError, utils} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const CONSTANTS = require('./../common/constants');
const ERRORS = require('./../common/constants/errors');

const logger = utils.logger.getLogger('models/PensionFund');

class PensionFund {

    constructor({address, name, amount = 0.0}) {
        this.address = address;
        this.name = name;
        this.amount = amount;
    }

    addAmount(amount) {
        this.amount += amount;
        return this;
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