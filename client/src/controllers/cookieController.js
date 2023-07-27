const daysToMilliSeconds = (days) => {
  return days * 24 * 60 * 60 * 1000;
};

const createCookie = (name, value, days) => {
  let expires = '';
  const date = new Date();
  if (days) {
    date.setTime(date.getTime() + (daysToMilliSeconds(days)));
    expires = `; expires=${date.toGMTString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
};

const readCookie = (name) => {
  const nameEQ = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const allCookies = decodedCookie.split(';');
  let cookie;
  for (let i = 0; i < allCookies.length; i++) {
    cookie = allCookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
};

module.exports = {
  createCookie,
  readCookie,
};
