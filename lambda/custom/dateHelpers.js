module.exports.getDayAndMonthFromDate = date => {
    return `<say-as interpret-as="date">${date
      .replace(/^.{4}/g, "????")
      .replaceAll("-", "")}</say-as>`;
  };

const months = {
  0: "Janvier",
  1: "Février",
  2: "Mars",
  3: "Avril",
  4: "Mai",
  5: "Juin",
  6: "Juillet",
  7: "Août",
  8: "Septembre",
  9: "Octobre",
  10: "Novembre",
  11: "Décembre"
}


module.exports.getTextDate = date => {
  const birthday = new Date(date);
  console.log("BIRTDAY:", birthday);
  return `Le ${birthday.getUTCDate()} ${months[birthday.getUTCMonth()]}`;
}
  
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