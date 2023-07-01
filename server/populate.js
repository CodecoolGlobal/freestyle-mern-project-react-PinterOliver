/* eslint-disable require-atomic-updates */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');
const BookModel = require('./model/Book');
const RoleModel = require('./model/Role');
const StoredItemModel = require('./model/StoredItem');
const Book = require('./model/Book');
const OrderHeader = require('./model/OrderHeader');
const OrderItem = require('./model/OrderItem');
const UserModel = require('./model/User');
const { updateHeader } = require('./controllers/orderItemsController');
const { lte } = require('semver');

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

const main = async () => {
  console.log('Connecting to DB');
  await mongoose.connect(mongoUrl);
  console.log('Successfully connected to DB');

  /*   await populateBooks();
  await populateRoles();
  await populateStorage();
  await populateUsers(); */
  await populateOrders();

  await mongoose.disconnect();
  console.log('Disconnected from DB');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function populateBooks() {
  await BookModel.deleteMany({});

  const genreList = [
    'fiction',
    'drama',
    'fantasy',
    'history',
    'children',
    'horror',
    'thriller',
    'biography',
    'crime',
    'philosophy',
    'poetry',
  ];

  let count = 0;
  const maxCount = genreList.length * 200;

  for (const genre of genreList) {

    const maxAmount = 200;
    const interval = 40;

    for (let fetchedAmount = 0; fetchedAmount < maxAmount; fetchedAmount += interval) {
      const fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=${interval}&startIndex=${fetchedAmount}`;

      const response = await fetch(fetchUrl);
      const jsonData = await response.json();

      let books = jsonData.items.map((book) => {
        return {
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : null,
          publishedYear: String(book.volumeInfo.publishedDate).substring(0, 4),
          price: book.saleInfo.listPrice?.amount,
          genres: book.volumeInfo.categories,
          description: book.volumeInfo.description,
          image_url: book.volumeInfo.imageLinks?.thumbnail ?? '',
        };
      });

      books = books.filter((book, index, array) => {
        if (
          !book.title ||
          !book.author ||
          !book.image_url ||
          !book.genres ||
          !book.genres.length ||
          !book.publishedYear ||
          !book.description ||
          array.slice(0, index).some((item) => item.title === book.title)
        ) return false;
        return true;
      });

      books.forEach((book) => {
        if (!book.price) {
          book.price = (Math.floor(Math.random() * 300) * 10) + 509;
        }
      });

      await BookModel.create(...books);
      count += books.length;
      console.log(`Books created (${count}/${maxCount})`);
    }
  }

  const books = await Book.find({});
  let counter = 0;

  await Promise.all(books.map(async (book, index, array) => {
    if (array.slice(0, index).some((item) => item.title === book.title)) {
      counter++;
      return await Book.findByIdAndDelete(book._id);
    }
    return {};
  }));

  console.log(`${count - counter} books created alltogether`);
}

async function populateRoles() {
  await RoleModel.deleteMany({});

  const roles = [
    {
      name: 'User',
      canViewItems: true,
    },
    {
      name: 'Admin',
      canViewItems: true,
      canModifyItems: true,
      canViewAllOrders: true,
      canViewAllUsers: true,
      canModifyRoles: true,
      canAccessStorage: true,
    },
    {
      name: 'Accountant',
      canViewItems: true,
      canViewAllOrders: true,
      canAccessStorage: true,
    },
    {
      name: 'Storekeeper',
      canViewItems: true,
      canAccessStorage: true,
    },
    {
      name: 'Customer_service_agent',
      canViewItems: true,
      canViewAllUsers: true,
    },
    {
      name: 'HR_manager',
      canViewItems: true,
      canViewAllUsers: true,
      canModifyRoles: true,
    },
    {
      name: 'Purchasing_agent',
      canViewItems: true,
      canModifyItems: true,
    },
    {
      name: 'Courier',
      canViewItems: true,
      canViewAllOrders: true,
    },
    {
      name: 'Boss',
      canViewItems: true,
    },
  ];

  await RoleModel.create(...roles);
  console.log('Roles created');
}

async function populateStorage() {
  await StoredItemModel.deleteMany({});

  const books = await Book.find({});
  const storage = books.map((book) => {
    return {
      item: book._id,
      amount: Math.floor(Math.random() * 40) + 10,
    };
  });

  await StoredItemModel.create(...storage);
  console.log('Created storage');
}

async function populateOrders() {
  await OrderHeader.deleteMany({});
  await OrderItem.deleteMany({});

  const states = [
    'cart',
    'placed',
    'order_confirmed',
    'transferred_to_shipping',
    'order_completed',
  ];

  let users = await UserModel.find({});
  users = users.map((user) => user._id);
  let books = await BookModel.find({});
  books = books.map((book) => book._id);

  const cartUsers = users.filter(() => Math.random() < 0.5);

  for (const user of cartUsers) {
    createOrder(user, cart, books);
  }
  //updateHeader(orderHeader);

}

async function populateUsers() {
  await UserModel.deleteMany({});

  let users = [
    {
      'name': {
        'first': 'Tamás',
        'last': 'Molnár',
      },
      'userName': 'tomocza',
      'role': 'Admin',
    },
    {
      'name': {
        'first': 'Olivér Péter',
        'last': 'Pintér',
      },
      'userName': 'Oliviero',
      'role': 'Customer_service_agent',
    },
    {
      'name': {
        'first': 'András',
        'last': 'Tóth',
      },
      'userName': 'BurgerKing',
      'role': 'HR_manager',
    },
    {
      'name': {
        'first': 'Benedek',
        'last': 'Sebestyén',
      },
      'userName': 'Bebe',
      'role': 'Storekeeper',
    },
    {
      'userName': 'DanDan',
      'name': {
        'first': 'Dániel',
        'last': 'Tóth',
      },
      'role': 'Courier',
    },
    {
      'userName': 'SasszemÁdám',
      'name': {
        'first': 'Ádám',
        'last': 'Kozák',
      },
      'role': 'Accountant',
    },
    {
      'userName': 'DogLover',
      'name': {
        'first': 'Lajos',
        'last': 'Sávoly',
      },
      'role': 'Purchasing_agent',
    },
    {
      'userName': 'CousinAdam',
      'name': {
        'first': 'Ádám',
        'last': 'Dulai',
      },
      'role': 'Boss',
    },
  ];

  users = [...users, ...generateRandomUsers(10)];

  users = await Promise.all(users.map(async (user) => {
    user.token = [];

    const role = await RoleModel.findOne({name: user.role});
    user.role = role._id;

    const password = genPassword();
    user.literalPassword = password;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    user.salt = salt;
    user.password = hashedPassword;

    const number = user.userName.replace(/\D/gi, '');
    let email = `${user.name.first}.${user.name.last}${number}@gmail.com`;
    email = email
      .replace(/á/gi, 'a')
      .replace(/é/gi, 'e')
      .replace(/í/gi, 'i')
      .replace(/[óöő]/gi, 'o')
      .replace(/[úüű]/gi, 'u');
    user.email = email.toLowerCase();

    const {city, post} = genCity();
    user.delivery = {
      country: 'Hungary',
      city: city,
      address: genStreet(),
      post_code: post,
    };

    user.telephone_number = genPhone();

    return user;
  }));

  const userstext = users.map((user) => `${user.userName}\n${user.literalPassword}`).join('\n\n');

  fs.writeFile('../passwords.txt', userstext, (err) => {
    if (err) console.log(err);
  });

  await UserModel.create(...users);

  console.log('Users created');
}

function generateRandomUsers(num) {
  // eslint-disable-next-line max-len
  const firstNames = ['Adam', 'Alex', 'Aaron', 'Ben', 'Carl', 'Dan', 'David', 'Edward', 'Fred', 'Frank', 'George', 'Hal', 'Hank', 'Ike', 'John', 'Jack', 'Joe', 'Larry', 'Monte', 'Matthew', 'Mark', 'Nathan', 'Otto', 'Paul', 'Peter', 'Roger', 'Roger', 'Steve', 'Thomas', 'Tim', 'Ty', 'Victor', 'Walter'];

  // eslint-disable-next-line max-len
  const lastNames = ['Anderson', 'Ashwoon', 'Aikin', 'Bateman', 'Bongard', 'Bowers', 'Boyd', 'Cannon', 'Cast', 'Deitz', 'Dewalt', 'Ebner', 'Frick', 'Hancock', 'Haworth', 'Hesch', 'Hoffman', 'Kassing', 'Knutson', 'Lawless', 'Lawicki', 'Mccord', 'McCormack', 'Miller', 'Myers', 'Nugent', 'Ortiz', 'Orwig', 'Ory', 'Paiser', 'Pak', 'Pettigrew', 'Quinn', 'Quizoz', 'Ramachandran', 'Resnick', 'Sagar', 'Schickowski', 'Schiebel', 'Sellon', 'Severson', 'Shaffer', 'Solberg', 'Soloman', 'Sonderling', 'Soukup', 'Soulis', 'Stahl', 'Sweeney', 'Tandy', 'Trebil', 'Trusela', 'Trussel', 'Turco', 'Uddin', 'Uflan', 'Ulrich', 'Upson', 'Vader', 'Vail', 'Valente', 'Van Zandt', 'Vanderpoel', 'Ventotla', 'Vogal', 'Wagle', 'Wagner', 'Wakefield', 'Weinstein', 'Weiss', 'Woo', 'Yang', 'Yates', 'Yocum', 'Zeaser', 'Zeller', 'Ziegler', 'Bauer', 'Baxster', 'Casal', 'Cataldi', 'Caswell', 'Celedon', 'Chambers', 'Chapman', 'Christensen', 'Darnell', 'Davidson', 'Davis', 'DeLorenzo', 'Dinkins', 'Doran', 'Dugelman', 'Dugan', 'Duffman', 'Eastman', 'Ferro', 'Ferry', 'Fletcher', 'Fietzer', 'Hylan', 'Hydinger', 'Illingsworth', 'Ingram', 'Irwin', 'Jagtap', 'Jenson', 'Johnson', 'Johnsen', 'Jones', 'Jurgenson', 'Kalleg', 'Kaskel', 'Keller', 'Leisinger', 'LePage', 'Lewis', 'Linde', 'Lulloff', 'Maki', 'Martin', 'McGinnis', 'Mills', 'Moody', 'Moore', 'Napier', 'Nelson', 'Norquist', 'Nuttle', 'Olson', 'Ostrander', 'Reamer', 'Reardon', 'Reyes', 'Rice', 'Ripka', 'Roberts', 'Rogers', 'Root', 'Sandstrom', 'Sawyer', 'Schlicht', 'Schmitt', 'Schwager', 'Schutz', 'Schuster', 'Tapia', 'Thompson', 'Tiernan', 'Tisler' ];

  const array = [];

  for (let i = 0; i < num; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    array.push(
      {
        'userName': `${first}${Math.floor((Math.random() * 89) + 10)}`,
        'name': {
          'first': first,
          'last': last,
        },
        'role': 'User',
      },
    );
  }

  return array;

}

function genPassword() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const passwordLength = 8;
  let password = '';
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars[randomNumber];
  }
  const randomNumber1 = Math.floor((Math.random() * 10) + 0);
  password += chars[randomNumber1];
  const randomNumber2 = Math.floor((Math.random() * 26) + 10);
  password += chars[randomNumber2];
  const randomNumber3 = Math.floor((Math.random() * 10) + 36);
  password += chars[randomNumber3];
  const randomNumber4 = Math.floor((Math.random() * 26) + 46);
  password += chars[randomNumber4];
  let newPassword = '';
  while (password.length > 0) {
    const rand = Math.floor(Math.random() * password.length);
    newPassword += password[rand];
    password = password.slice(0, rand) + password.slice(rand + 1);
  }
  return newPassword;
}

function genPhone() {
  let phone = '+36';
  const pre = ['20', '30', '70'];
  phone += pre[Math.floor(Math.random() * pre.length)];
  for (let i = 0; i < 7; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
}

function genCity() {
  // eslint-disable-next-line max-len
  const cityList = ['Aba', 'Abádszalók', 'Abaújszántó', 'Abony', 'Ács', 'Adony', 'Ajak', 'Ajka', 'Albertirsa', 'Alsózsolca', 'Aszód', 'Bábolna', 'Bácsalmás', 'Badacsonytomaj', 'Baja', 'Baktalórántháza', 'Balassagyarmat', 'Balatonalmádi', 'Balatonboglár', 'Balatonföldvár', 'Balatonfüred', 'Balatonfűzfő', 'Balatonkenese', 'Balatonlelle', 'Balkány', 'Balmazújváros', 'Barcs', 'Bátaszék', 'Bátonyterenye', 'Battonya', 'Békés', 'Békéscsaba', 'Bélapátfalva', 'Beled', 'Berettyóújfalu', 'Berhida', 'Besenyszög', 'Biatorbágy', 'Bicske', 'Biharkeresztes', 'Bodajk', 'Bóly', 'Bonyhád', 'Borsodnádasd', 'Budakalász', 'Budakeszi', 'Budaörs', 'Budapest', 'Bük', 'Cegléd', 'Celldömölk', 'Cigánd', 'Csákvár', 'Csanádpalota', 'Csenger', 'Csepreg', 'Csongrád', 'Csorna', 'Csorvás', 'Csurgó', 'Dabas', 'Debrecen', 'Demecser', 'Derecske', 'Dévaványa', 'Devecser', 'Diósd', 'Dombóvár', 'Dombrád', 'Dorog', 'Dunaföldvár', 'Dunaharaszti', 'Dunakeszi', 'Dunaújváros', 'Dunavarsány', 'Dunavecse', 'Edelény', 'Eger', 'Elek', 'Emőd', 'Encs', 'Enying', 'Ercsi', 'Érd', 'Esztergom', 'Fegyvernek', 'Fehérgyarmat', 'Felsőzsolca', 'Fertőd', 'Fertőszentmiklós', 'Fonyód', 'Fót', 'Füzesabony', 'Füzesgyarmat', 'Gárdony', 'Göd', 'Gödöllő', 'Gönc', 'Gyál', 'Gyomaendrőd', 'Gyömrő', 'Gyöngyös', 'Gyöngyöspata', 'Gyönk', 'Győr', 'Gyula', 'Hajdúböszörmény', 'Hajdúdorog', 'Hajdúhadház', 'Hajdúnánás', 'Hajdúsámson', 'Hajdúszoboszló', 'Hajós', 'Halásztelek', 'Harkány', 'Hatvan', 'Herend', 'Heves', 'Hévíz', 'Hódmezővásárhely', 'Ibrány', 'Igal', 'Isaszeg', 'Izsák', 'Jánoshalma', 'Jánosháza', 'Jánossomorja', 'Jászapáti', 'Jászárokszállás', 'Jászberény', 'Jászfényszaru', 'Jászkisér', 'Kaba', 'Kadarkút', 'Kalocsa', 'Kaposvár', 'Kapuvár', 'Karcag', 'Kazincbarcika', 'Kecel', 'Kecskemét', 'Kemecse', 'Kenderes', 'Kerekegyháza', 'Kerepes', 'Keszthely', 'Kisbér', 'Kisköre', 'Kiskőrös', 'Kiskunfélegyháza', 'Kiskunhalas', 'Kiskunlacháza', 'Kiskunmajsa', 'Kistarcsa', 'Kistelek', 'Kisújszállás', 'Kisvárda', 'Komádi', 'Komárom', 'Komló', 'Kondoros', 'Kozármisleny', 'Körmend', 'Körösladány', 'Kőszeg', 'Kunhegyes', 'Kunszentmárton', 'Kunszentmiklós', 'Lábatlan', 'Lajosmizse', 'Lébény', 'Lengyeltóti', 'Lenti', 'Létavértes', 'Letenye', 'Lőrinci', 'Maglód', 'Mágocs', 'Makó', 'Mándok', 'Marcali', 'Máriapócs', 'Martfű', 'Martonvásár', 'Mátészalka', 'Medgyesegyháza', 'Mélykút', 'Mezőberény', 'Mezőcsát', 'Mezőhegyes', 'Mezőkeresztes', 'Mezőkovácsháza', 'Mezőkövesd', 'Mezőtúr', 'Mindszent', 'Miskolc', 'Mohács', 'Monor', 'Mór', 'Mórahalom', 'Mosonmagyaróvár', 'Nádudvar', 'Nagyatád', 'Nagybajom', 'Nagyecsed', 'Nagyhalász', 'Nagykálló', 'Nagykanizsa', 'Nagykáta', 'Nagykőrös', 'Nagymányok', 'Nagymaros', 'Nyékládháza', 'Nyergesújfalu', 'Nyíradony', 'Nyírbátor', 'Nyírbogát', 'Nyíregyháza', 'Nyírlugos', 'Nyírmada', 'Nyírtelek', 'Ócsa', 'Onga', 'Orosháza', 'Oroszlány', 'Ózd', 'Őrbottyán', 'Őriszentpéter', 'Örkény', 'Pacsa', 'Paks', 'Pálháza', 'Pannonhalma', 'Pápa', 'Pásztó', 'Pécel', 'Pécs', 'Pécsvárad', 'Pétervására', 'Pilis', 'Piliscsaba', 'Pilisvörösvár', 'Polgár', 'Polgárdi', 'Pomáz', 'Pusztaszabolcs', 'Putnok', 'Püspökladány', 'Rácalmás', 'Ráckeve', 'Rakamaz', 'Rákóczifalva', 'Répcelak', 'Rétság', 'Rudabánya', 'Sajóbábony', 'Sajószentpéter', 'Salgótarján', 'Sándorfalva', 'Sárbogárd', 'Sarkad', 'Sárospatak', 'Sárvár', 'Sásd', 'Sátoraljaújhely', 'Sellye', 'Siklós', 'Simontornya', 'Siófok', 'Solt', 'Soltvadkert', 'Sopron', 'Sülysáp', 'Sümeg', 'Szabadszállás', 'Szarvas', 'Százhalombatta', 'Szécsény', 'Szeged', 'Szeghalom', 'Székesfehérvár', 'Szekszárd', 'Szendrő', 'Szentendre', 'Szentes', 'Szentgotthárd', 'Szentlőrinc', 'Szerencs', 'Szigethalom', 'Szigetszentmiklós', 'Szigetvár', 'Szikszó', 'Szob', 'Szolnok', 'Szombathely', 'Tab', 'Tamási', 'Tápiószele', 'Tapolca', 'Tát', 'Tata', 'Tatabánya', 'Téglás', 'Tét', 'Tiszacsege', 'Tiszaföldvár', 'Tiszafüred', 'Tiszakécske', 'Tiszalök', 'Tiszaújváros', 'Tiszavasvári', 'Tokaj', 'Tolna', 'Tompa', 'Tótkomlós', 'Tököl', 'Törökbálint', 'Törökszentmiklós', 'Tura', 'Túrkeve', 'Újfehértó', 'Újhartyán', 'Újkígyós', 'Újszász', 'Üllő', 'Vác', 'Vaja', 'Vámospércs', 'Várpalota', 'Vásárosnamény', 'Vasvár', 'Vecsés', 'Velence', 'Vép', 'Veresegyház', 'Verpelét', 'Veszprém', 'Vésztő', 'Villány', 'Visegrád', 'Záhony', 'Zalaegerszeg', 'Zalakaros', 'Zalalövő', 'Zalaszentgrót', 'Zamárdi', 'Zirc', 'Zsámbék'];
  // eslint-disable-next-line max-len
  const postList = ['8127', '5241', '3881', '2740', '2941', '2457', '4524', '8400', '2730', '3571', '2170', '2943', '6430', '8258', '6500', '4561', '2660', '8220', '8630', '8623', '8230', '8175', '8172', '8638', '4233', '4060', '7570', '7140', '3070', '5830', '5630', '5600', '3346', '9343', '4100', '8181', '5071', '2051', '2060', '4110', '8053', '7754', '7150', '3671', '2011', '2092', '2040', '1000', '9737', '2700', '9500', '3973', '8083', '6913', '4765', '9735', '6640', '9300', '5920', '8840', '2370', '4000', '4516', '4130', '5510', '8460', '2049', '7200', '4492', '2510', '7020', '2330', '2120', '2400', '2336', '6087', '3780', '3300', '5742', '3432', '3860', '8130', '2451', '2030', '2500', '5231', '4900', '3561', '9431', '9444', '8640', '2151', '3390', '5525', '2483', '2131', '2100', '3895', '2360', '5500', '2230', '3200', '3035', '7064', '9000', '5700', '4220', '4087', '4242', '4080', '4251', '4200', '6344', '2314', '7815', '3000', '8440', '3360', '8380', '6800', '4484', '7275', '2117', '6070', '6440', '9545', '9241', '5130', '5123', '5100', '5126', '5137', '4183', '7530', '6300', '7400', '9330', '5300', '3700', '6237', '6000', '4501', '5331', '6041', '2144', '8360', '2870', '3384', '6200', '6100', '6400', '2340', '6120', '2143', '6760', '5310', '4600', '4138', '2900', '7300', '5553', '7761', '9900', '5516', '9730', '5340', '5440', '6090', '2541', '6050', '9155', '8693', '8960', '4281', '8868', '3021', '2234', '7342', '6900', '4644', '8700', '4326', '5435', '2462', '4700', '5666', '6449', '5650', '3450', '5820', '3441', '5800', '3400', '5400', '6630', '3500', '7700', '2200', '8060', '6782', '9200', '4181', '7500', '7561', '4355', '4485', '4320', '8800', '2760', '2750', '7355', '2626', '3433', '2536', '4254', '4300', '4361', '4400', '4371', '4564', '4461', '2364', '3562', '5900', '2840', '3600', '2162', '9941', '2377', '8761', '7030', '3994', '9090', '8500', '3060', '2119', '7600', '7720', '3250', '2721', '2081', '2085', '4090', '8154', '2013', '2490', '3630', '4150', '2459', '2300', '4465', '5085', '9653', '2651', '3733', '3792', '3770', '3100', '6762', '7000', '5720', '3950', '9600', '7370', '3980', '7960', '7800', '7081', '8600', '6320', '6230', '9400', '2241', '8330', '6080', '5540', '2440', '3170', '6700', '5520', '8000', '7100', '3752', '2000', '6600', '9970', '7940', '3900', '2315', '2310', '7900', '3800', '2628', '5000', '9700', '8660', '7090', '2766', '8300', '2534', '2890', '2800', '4243', '9100', '4066', '5430', '5350', '6060', '4450', '3580', '4440', '3910', '7130', '6422', '5940', '2316', '2045', '5200', '2194', '5420', '4244', '2367', '5661', '5052', '2225', '2600', '4562', '4287', '8100', '4800', '9800', '2220', '2481', '9751', '2112', '3351', '8200', '5530', '7773', '2025', '4625', '8900', '8749', '8999', '8790', '8621', '8420', '2072'];
  const rand = Math.floor(Math.random() * cityList.length);
  return {city: cityList[rand], post: postList[rand]};
}

function genStreet() {
  // eslint-disable-next-line max-len
  const streetList = ['Ady Endre', 'Dózsa György', 'Petőfi Sándor', 'Kossuth Lajos', 'Rákóczi Ferenc', 'Arany János', 'József Attila', 'Szabadság', 'Béke'];
  const addList = ['utca', 'út', 'tér'];
  let street = `${streetList[Math.floor(Math.random() * streetList.length)]}`;
  street += ` ${addList[Math.floor(Math.random() * addList.length)]}`;
  const number = Math.floor(Math.random() * 199) + 1;
  street += ` ${number}.`;
  return street;
}
