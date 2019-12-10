const constants = require("../constants");
const helpers = require("../helpers");
const dynamoHelpers = require("../dynamoHelpers");

const DeleteBirthdayHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "DeleteBirthdayIntent"
    );
  },
  async handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const userId = handlerInput.requestEnvelope.session.user.userId;
    let friend =
      request.intent.slots.friend != null
        ? request.intent.slots.friend.value
        : "";

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const session = { ...sessionAttributes, friend };
    handlerInput.attributesManager.setSessionAttributes(session);

    let speechOutput = "";
    const contactInDb = await dynamoHelpers.findContactInDb(userId, friend);
    if (contactInDb.length > 0) { // ALREADY ADDED SAME NAME
      const data = await dynamoHelpers.deleteBirthday(contactInDb[0].id);
      speechOutput = helpers.getRandomMessage(succesMessages).replace("friend", friend);
      if (data == null) {
        speechOutput = helpers.getRandomMessage(errorMessages);
      }
    } else {
      speechOutput = helpers
          .getRandomMessage(notInDb)
          .replace("friend", friend);
    }
    
    return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(constants.SKILL_NAME, speechOutput)
        .withShouldEndSession(true)
        .getResponse();
  }
};

const succesMessages = [
  `L'anniversaire de friend a bien été supprimé`
];

const errorMessages = [
  "Il y a eu un problème lors de l'effacement de l'anniversaire, veuillez réesayer ultérieurement"
];

const notInDb = [
  "Vous n'avez pas encore enrregistrer d'anniversaire pour friend."
]

module.exports = DeleteBirthdayHandler;
