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
    search[key] = {};
    search[key]["$in"] = array;
    console.log(search);
    return search
}

const toSort = (sortBy, key, ascend) => {
    switch (ascend) {
        case "ascend":
            sortBy = {};
            sortBy[key] = 1;
            break;
        case "descend":
            sortBy = {};
            sortBy[key] = -1;
    };
    console.log(sortBy);
    return sortBy
}

module.exports = {
  stringSearch,
  numberSearch,
  arraySearch,
  toSort,
};
