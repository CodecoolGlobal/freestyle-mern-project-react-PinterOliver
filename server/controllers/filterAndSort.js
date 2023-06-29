const numberSearch = (search, key, number, type) => {
  search[key] = {};
  search[key][`$${type}`] = number;
  return search;
};

const stringSearch = (search, key, string) => {
  search[key] = {};
  search[key]['$regex'] = string;
  search[key]['$options'] = 'i';
  return search;
};

const arraySearch = (search, key, array) => {
  search[key] = {};
  search[key]['$in'] = array;
  return search;
};

const toSort = (sortBy, key, ascend) => {
  switch (ascend) {
  case 'ascend':
    sortBy = {};
    sortBy[key] = 1;
    break;
  case 'descend':
    sortBy = {};
    sortBy[key] = -1;
  }
  return sortBy;
};

module.exports = {
  stringSearch,
  numberSearch,
  arraySearch,
  toSort,
};
