const {ChaincodeError, utils} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const CONSTANTS = require('./../common/constants');
const ERRORS = require('./../common/constants/errors');

const logger = utils.logger.getLogger('models/Participant');

class Participant {

    constructor({address, UID, entitlements = 0.0, pensionFund, person}) {
        this.address = address;
        this.UID = UID;
        this.entitlements = entitlements;
        this.pensionFund = pensionFund;
        this.person = person;
        this.status = 'ACTIVE';
    }

    addEntitlements(entitlements) {
        this.entitlements += entitlements;
        return this;
    }

    deactivateParticipant() {
        this.status = 'INACTIVE';
    }

    closeParticipant() {
        this.status ='TRANSFERRED';
    }

    async save(txHelper) {
        await txHelper.putState(this.address, {
            'address': this.address,
            'UID': this.UID,
            'entitlements': this.entitlements,
            'pensionFund': this.pensionFund,
            'status': this.status
        });

        return this;
    }

    static async queryParticipantByAddress(txHelper, address) {
        const dbData = await txHelper.getStateAsObject(address);
        if(!dbData) {
            throw new ChaincodeError(ERRORS.UNKNOWN_ENTITY, {
                'address': address
            });
        }
        return mapDBDataToObject(dbData);
    }
}

module.exports = Participant;

/**
 *   Converts a database participant to a specific instance of a participant.
 *   @param {Object} dbData the participant as retrieved from the blockchain
 *   @return {Instance} an instance of the participant
 */
function mapDBDataToObject(dbData) {

    const Class = require(`./Participant`);

    // Create an instance of that class
    const instance = new Class({
        address: dbData.address,
        UID: dbData.UID,
        entitlements: dbData.entitlements,
        pensionFund: dbData.pensionFund,
        status: dbData.status
    });

    // Return the instance
    return instance;
}
