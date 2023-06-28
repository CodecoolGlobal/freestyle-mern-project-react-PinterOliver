const numberSearch = (search, key, number, type) => {
    search[key] = {};
    search[key][`$${type}`] = number;
    console.log(search);
    return search
}

const stringSearch = (search, key, string) => {
    search[key] = {};
    search[key]["$regex"] = string;
    search[key]["$options"] = "i";
    console.log(search);
    return search
}

const arraySearch = (search, key, array) => {
    console.log(search);
    return search
}

const toSort = (search, key, isAscend) => {
    console.log(search);
    return search
}

module.exports = {
  stringSearch,
  numberSearch,
  arraySearch,
  toSort,
};
