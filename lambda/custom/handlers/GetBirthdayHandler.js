const constants = require("../constants");
const dynamoHelpers = require("../dynamoHelpers");
const dateHelpers = require("../dateHelpers");

const GetBirthdayHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetBirthdayIntent"
    );
  },
  async handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const userId = handlerInput.requestEnvelope.session.user.userId;
    const friend =
      request.intent.slots.friend != null
        ? request.intent.slots.friend.value
        : "";

    const messageIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[messageIndex];

    let got;
    try {
      got = await dynamoHelpers.findContactInDb(userId, friend);
    } catch (err) {
      console.log("ERR", err);
    }
   
    if (got.length > 0) {
      const speechOutput = randomMessage
        .replace("friend", friend)
        .replace("birthdate", dateHelpers.getDayAndMonthFromDate(got[0].birthdate)).replace("number", dateHelpers.getNbOfDaysToNextBirthday(got[0].birthdate));
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(constants.SKILL_NAME, speechOutput)
        .withShouldEndSession(false)
        .getResponse();
    } else {
        const errorMessage = "Aucun ami s'appelant friend n'a été trouvé".replace("friend", friend);
        return handlerInput.responseBuilder
        .speak(errorMessage)
        .withSimpleCard(constants.SKILL_NAME, errorMessage)
        .withShouldEndSession(false)
        .getResponse();
    }
  }
};

const messages = [`L'anniversaire de friend est le birthdate, c'est dans number jours`];

module.exports = GetBirthdayHandler;
