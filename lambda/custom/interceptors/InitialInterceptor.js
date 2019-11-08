const initialＳtate = {
    friend: ""
  };

const InitialInterceptor = {
    process(handlerInput) {
        if (handlerInput.requestEnvelope.session.new) {
            handlerInput.attributesManager.setSessionAttributes(initialＳtate);
        }
    return;
    }
};

module.exports = InitialInterceptor;