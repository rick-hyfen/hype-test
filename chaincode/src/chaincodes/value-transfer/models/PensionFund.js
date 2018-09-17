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

    async addParticipant(txHelper, participant) {
        this.participants.push(participant);
        await this.save(txHelper);
    }

    async save(txHelper) {
        await txHelper.putState(this.address, {
            'address': this.address,
            'name': this.name,
            'participants': this.participants
        });

        return this;
    }

    static async queryPensionFundByAddress(txHelper, address) {
        const dbData = await txHelper.getStateAsObject(address);
        if(!dbData) {
            throw new ChaincodeError(ERRORS.UNKNOWN_ENTITY, {
                'address': address
            });
        }
        return mapDBDataToObject(dbData);
    }
}

module.exports = PensionFund;

/**
 *   Converts a database pension fund to a specific instance of a pension fund.
 *   @param {Object} dbData the pension fund as retrieved from the blockchain
 *   @return {Instance} an instance of the pension fund
 */
function mapDBDataToObject(dbData) {

    const Class = require(`./PensionFund`);

    // Create an instance of that class
    const instance = new Class({
        address: dbData.address,
        name: dbData.name,
        participants: dbData.participants
    });

    // Return the instance
    return instance;
}
