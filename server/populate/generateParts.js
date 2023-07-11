const fs = require('fs');

const firstNames = require('./firstNames.json');
const lastNames = require('./lastNames.json');
const cityList = require('./cityList.json');
const streetNameList = require('./streetNameList.json');
const streetTypeList = require('./streetTypeList.json');

function pick (from) {
  return from[Math.floor(Math.random() * (from.length - 0))];
}

function generateNumber (a, b) {
  return Math.floor((Math.random() * (b - a + 1)) + a);
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
  return `${pick(streetNameList)} ${pick(streetTypeList)} ${generateNumber(1, 199)}`;
}

function generatePassword() {
  const charSets = [
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
    '!@#$%^&*()',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ];
  const chars = charSets.join('');
  const passwordLength = 8;
  let password = Array.from(Array(passwordLength), () => pick(chars));
  password += charSets.map((item) => pick(item)).join('');
  let newPassword = '';
  while (password.length > 0) {
    const rand = generateNumber(0, password.length - 1);
    newPassword += password[rand];
    password = password.slice(0, rand) + password.slice(rand + 1);
  }
  return newPassword;
}

function generatePhone() {
  let phone = '+36';
  const phonePrefixes = ['20', '30', '70'];
  phone += pick(phonePrefixes);
  const numberOfDigits = 7;
  phone += Array.from(Array(numberOfDigits), () => generateNumber(0, 9));
  return phone;
}

function generateRandomUsers(num) {
  const array = [];

  for (let i = 0; i < num; i++) {
    let first;
    let last;
    let userName;
    let name;
    const nameArray = [];
    const userNameArray = [];
    do {
      first = pick(firstNames);
      last = pick(lastNames);
      userName = `${first}${generateNumber(10, 99)}`;
      name = first + last;
    } while (
      userNameArray.includes(userName) ||
      nameArray.includes(name)
    );
    nameArray.push(name);
    userNameArray.push(userName);
    const newPerson = {
      'userName': userName,
      'name': {
        'first': first,
        'last': last,
      },
      'role': 'User',
    };
    array.push(newPerson);
  }

  return array;
}

function writeNewFile () {
  const names = [''];
  fs.writeFileSync('./populate/nnn.json', JSON.stringify(names, null, 2));
}

writeNewFile();

module.exports = {
  pick,
  generateNumber,
  generateDate,
  generateCity,
  generateStreet,
  generatePassword,
  generatePhone,
  generateRandomUsers,
};
