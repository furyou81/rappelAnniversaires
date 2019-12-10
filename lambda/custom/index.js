const Alexa = require('ask-sdk-core');
const InitialInterceptor = require("interceptors/InitialInterceptor");
const WelcomeHandler = require("handlers/WelcomeHandler");
const AddBirthdayHandler = require("handlers/AddBirthdayHandler");
const GetBirthdayHandler = require("handlers/GetBirthdayHandler");
const DeleteBirthdayHandler = require("handlers/DeleteBirthdayHandler");
const helpers = require("helpers");

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak("Pour ajouter un anniversaire, dites le nom de votre ami suivi de son anniversaire. Pour en supprimer un dites supprimer suivi du nom de votre ami. Pour connaitre sa date d'anniversaire demander le à Alexa")
      .reprompt('HELP_REPROMPT')
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak('FALLBACK_MESSAGE')
      .reprompt('FALLBACK_REPROMPT')
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(`${helpers.interjection("Au revoir")} et à bientôt, merci d'utiliser rappel anniversaires!`)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak("Une erreur s'est produite")
      .reprompt('ERROR_MESSAGE')
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    WelcomeHandler,
    AddBirthdayHandler,
    GetBirthdayHandler,
    DeleteBirthdayHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(InitialInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();