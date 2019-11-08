module.exports.getDayAndMonthFromDate = date => {
    return `<say-as interpret-as="date">${date
      .replace(/^.{4}/g, "????")
      .replaceAll("-", "")}</say-as>`;
  };
  
  module.exports.getNbOfDaysToNextBirthday = date => {
    const now = new Date();
    const birthday = new Date(date);
    let year = now.getUTCFullYear();
    if (
      birthday.getUTCMonth() < now.getUTCMonth() ||
      (birthday.getUTCMonth() === now.getUTCMonth() &&
        birthday.getUTCDate() < now.getUTCDate())
    ) {
      year++;
    }
    const nextBirthdate = new Date(date.replace(/^.{4}/g, year));
    const difference = nextBirthdate.getTime() - now.getTime();
    const nbOfDays = Math.ceil(difference / (1000 * 3600 * 24));
    return nbOfDays;
  };
  
  String.prototype.replaceAll = function(search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, "g"), replacement);
  };