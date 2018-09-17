const shim = require('fabric-shim'); // eslint-disable-line
const {ChaincodeBase, ChaincodeError} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const ERRORS = require('./common/constants/errors');
const CONSTANTS = require('./common/constants/index');

const PensionFund = require('./models/PensionFund');
const Person = require('./models/Person');
const Participant = require('./models/Participant');

const Joi = require('./common/services/joi');

/**
*   Defines the behavior of wallets that can transfer funds from one another,
*   with permissions on who can transfer funds.
*   Can create 2 types of wallets:
*   - User wallets owned by a user
*   - Contract wallets owned by a chaincode
*/
const ValueTransferChaincode = class extends ChaincodeBase {

    async createPensionFund(stub, txHelper, name) {
        return new PensionFund({
            address: txHelper.uuid(CONSTANTS.PREFIXES.PENSION_FUND),
            name: name
        }).save(txHelper);

    }

    async createPerson(stub, txHelper, bsn, name) {
        return new PensionFund({
            address: txHelper.uuid(CONSTANTS.PREFIXES.PERSON),
            bsn: bsn,
            name: name
        }).save(txHelper);

    }

    async createPensionFund(stub, txHelper, name) {
        return new PensionFund({
            address: txHelper.uuid(CONSTANTS.PREFIXES.PENSION_FUND),
            name: name
        }).save(txHelper);

    }

    async createPerson(stub, txHelper, bsn, name) {
        return new PensionFund({
            address: txHelper.uuid(CONSTANTS.PREFIXES.PERSON),
            bsn: bsn,
            name: name
        }).save(txHelper);

    }

    async createParticipant(stub, txHelper, entitlements, pensionFundAddress, personAddress) {

        const pensionFund = await PensionFund.queryPensionFundByAddress(txHelper, pensionFundAddress);

        const person = await Person.queryPersonByAddress(txHelper, personAddress);

        const UID = pensionFund.name.concat(String(person.bsn));

        const participant = await new Participant({
            address: txHelper.uuid(CONSTANTS.PREFIXES.PARTICIPANT),
            UID: UID,
            entitlements: entitlements,
            pensionFund: pensionFundAddress,
            person: personAddress
        }).save(txHelper);

        pensionFund.addParticipant(txHelper, participant);
        person.addParticipation(txHelper, participant);


        return participant;

    }

};

shim.start(new ValueTransferChaincode(shim));
