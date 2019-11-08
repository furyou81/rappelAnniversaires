module.exports.interjection = inter => {
  return `<say-as interpret-as="interjection">${inter}</say-as>`;
};

module.exports.getRandomMessage = messages => {
  return messages[Math.floor(Math.random() * messages.length)];
};

module.exports.whisper = (message) => {
    return `<amazon:effect name="whispered">${message}</amazon:effect>`;
}

module.exports.audio = (src) => {
    return `<audio src="${src}" />`;
}

module.exports.break = (seconds) => {
    return `<break time="${seconds}s"/>`;
}

module.exports.celine = (message) => {
    return ` <voice name="Celine">${message}</voice>`;
}

module.exports.lea = (message) => {
    return ` <voice name="Lea">${message}</voice>`;
}

module.exports.mathieu = (message) => {
    return ` <voice name="Mathieu">${message}</voice>`;
}