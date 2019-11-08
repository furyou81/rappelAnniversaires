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
    console.log("IN DELETE BIRTHDAY INTENT");
    let friend =
      request.intent.slots.friend != null
        ? request.intent.slots.friend.value
        : "";

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    if (friend == null) {
      friend = sessionAttributes.friend;
    }

    const session = { ...sessionAttributes, friend };
    handlerInput.attributesManager.setSessionAttributes(session);

    let speechOutput = "";
    console.log("BEFORE FIND CONTACT", userId, friend);
    const contactInDb = await dynamoHelpers.findContactInDb(userId, friend);
    console.log("AFTER FIND CONTACT", contactInDb);
    if (contactInDb.length > 0) { // ALREADY ADDED SAME NAME
      console.log("ALREADY ADDED");
      const data = await dynamoHelpers.deleteBirthday(contactInDb[0].id);
      console.log("DATA", data)
      speechOutput = helpers.getRandomMessage(succesMessages).replace("friend", friend);
      if (data == null) {
        speechOutput = helpers.getRandomMessage(errorMessages);
      }
    } else {
      speechOutput = helpers
          .getRandomMessage(notInDb)
          .replace("friend", friend);
    }
    
    console.log("WILL RESPONSE", speechOutput);
    return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(constants.SKILL_NAME, speechOutput)
        .withShouldEndSession(false)
        .getResponse();
  }
};

const succesMessages = [
  `${helpers.interjection(
    "C'est noté"
  )}, l'anniversaire de friend a bien été supprimé`
];

const errorMessages = [
  "Il y a eu un problème lors de l'effacement de l'anniversaire, veuillez réesayer ultérieurement"
];

const notInDb = [
  "Vous n'avez pas encore enrregistrer d'anniversaire pour friend."
]

module.exports = DeleteBirthdayHandler;
