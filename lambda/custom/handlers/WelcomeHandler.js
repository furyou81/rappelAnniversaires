const constants = require("../constants");
const helpers = require("../helpers");

const WelcomeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const messageIndex = Math.floor(Math.random() * welcomeMessages.length);
    const randomMessage = welcomeMessages[messageIndex];
    const speechOutput = randomMessage;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(constants.SKILL_NAME, "Bonjour, bienveue dans Rappel Anniversaires:)")
      .withShouldEndSession(false)
      .getResponse();
  },
};


// message different si pas la premiere fois
const welcomeMessages = [
    `${helpers.interjection("Bonjour")}, bienvenue dans ${constants.SKILL_NAME} l'application qui vous aide à vous rappeler de la date d'anniversaire de vos amis! Pour ajouter un anniversaire, dites le nom de votre ami suivi de sa date d'anniversaire.`
  ]
  
module.exports = WelcomeHandler;