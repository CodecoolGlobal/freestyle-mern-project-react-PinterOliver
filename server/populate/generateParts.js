const fs = require('fs');

const cityList = require('./cityList.json');
const streetNameList = require('./streetNameList.json');
const streetTypeList = require('./streetTypeList.json');

function pick (from) {
  return from[Math.floor(Math.random() * (from.length - 0))];
}

function generateNumber (a, b) {
  return Math.floor((Math.random() * (b - a)) + a);
}

function generateDate (a, b) {
  const start = new Date(a);
  const end = new Date(b);
  const rand = generateNumber(start.valueOf(), end.valueOf());
  return new Date(rand);
}

function generateCity() {
  const city = pick(cityList);
  return {city: city.name, post: city.postcode};
}

function generateStreet() {
  //fs.writeFileSync('./populate/streetTypeList.json', JSON.stringify(addList, null, 2));
  let street = `${pick(streetNameList)} ${pick(streetTypeList)}`;
  street += ` ${streetTypeList[Math.floor(Math.random() * streetTypeList.length)]}`;
  const number = Math.floor(Math.random() * 199) + 1;
  street += ` ${number}.`;
  return street;
}

generateStreet();

module.exports = {
  pick,
  generateNumber,
  generateDate,
  generateCity,
  generateStreet,
};
