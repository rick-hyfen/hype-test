const {ChaincodeError, utils} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const CONSTANTS = require('./../common/constants');
const ERRORS = require('./../common/constants/errors');

const logger = utils.logger.getLogger('models/Person');

class Person {

    constructor({address, bsn, name}) {
        this.address = address;
        this.bsn = bsn;
        this.name = name;
        this.participations = []
    }

    async addParticipation(txHelper, participant) {
        this.participations.push(participant);
        await this.save(txHelper);
    }

    async save(txHelper) {
        await txHelper.putState(this.address, {
            'address': this.address,
            'bsn': this.bsn,
            'name': this.name,
            'participations': this.participations
        });

        return this;
    }

    static async queryPersonByAddress(txHelper, address) {
        const dbData = await txHelper.getStateAsObject(address);
        if(!dbData) {
            throw new ChaincodeError(ERRORS.UNKNOWN_ENTITY, {
                'address': address
            });
        }
        return mapDBDataToObject(dbData);
    }
}

module.exports = Person;

/**
 *   Converts a database person to a specific instance of a person.
 *   @param {Object} dbData the person as retrieved from the blockchain
 *   @return {Instance} an instance of the participant
 */
function mapDBDataToObject(dbData) {

    const Class = require(`./Person`);

    // Create an instance of that class
    const instance = new Class({
        address: dbData.address,
        bsn: dbData.bsn,
        name: dbData.name,
        participations: dbData.participations
    });

    // Return the instance
    return instance;
}
