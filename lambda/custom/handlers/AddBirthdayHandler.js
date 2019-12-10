const constants = require("../constants");
const helpers = require("../helpers");
const dateHelpers = require("../dateHelpers");
const dynamoHelpers = require("../dynamoHelpers");

const AddBirthdayHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AddBirthdayIntent"
    );
  },
  async handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const userId = handlerInput.requestEnvelope.session.user.userId;
    const friend =
      request.intent.slots.friend != null
        ? request.intent.slots.friend.value
        : "";
    const birthdate =
      request.intent.slots.birthdate != null
        ? request.intent.slots.birthdate.value
        : "";

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const session = { ...sessionAttributes, friend };

    handlerInput.attributesManager.setSessionAttributes(session);
    let speechOutput = "";
    let card = "";
    const contactInDb = await dynamoHelpers.findContactInDb(userId, friend);
    if (contactInDb.length > 0) { // ALREADY ADDED SAME NAME
      speechOutput = helpers.getRandomMessage(alreadyExistMessages).replace("friend", friend).replace("birthdate", dateHelpers.getDayAndMonthFromDate(contactInDb[0].birthdate));
      card = helpers.getRandomMessage(alreadyExistMessages).replace("friend", friend).replace("le birthdate", dateHelpers.getTextDate(contactInDb[0].birthdate));
    } else {
      const item = {
        userId: handlerInput.requestEnvelope.session.user.userId,
        friend: friend,
        birthdate: birthdate
      };
      const data = await dynamoHelpers.add("birthday", item);
      if (data != null) { // SUCCESS ADDED
        speechOutput = helpers
          .getRandomMessage(succesMessages)
          .replace("friend", friend)
          .replace("birthdate", dateHelpers.getDayAndMonthFromDate(birthdate));
        card = "friend a bien été ajouté".replace("friend", friend);
      } else { // ERROR ADDING
        speechOutput = helpers.getRandomMessage(errorMessages);
        card = speechOutput;
      }
    }
    
    return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(constants.SKILL_NAME, card)
        .withShouldEndSession(true)
        .getResponse();
  }
};

const succesMessages = [
  `${helpers.interjection(
    "C'est noté"
  )}, vous venez d'ajouter friend qui est né le birthdate`
];

const errorMessages = [
  "Il y a eu un problème lors de l'ajout de l'anniversaire, veuillez réessayer ultérieurement"
];

const alreadyExistMessages = [
  "Vous avez déja enregistrer un anniversaire le birthdate pour friend."
]

module.exports = AddBirthdayHandler;
