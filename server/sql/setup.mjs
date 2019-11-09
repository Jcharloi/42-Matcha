import pgtools from "pgtools";
import opencage from "opencage-api-client";
import pg from "pg";
import fs from "fs";
import dbKeys from "./dbKeys.json";
import faker from "faker";
import escape from "pg-escape";
import Axios from "axios";
import keys from "../keys.json";

const { odg_api_key } = keys;
const { user, password } = dbKeys;

const pool = new pg.Pool({
  user: user,
  host: "localhost",
  database: "matcha",
  password: password,
  port: "5432"
});

const sql = fs.readFileSync("./sql/setup.sql").toString();
const pictures = fs.readdirSync("./public/profile-pictures/");

const tags = [
  "Make-up",
  "Pet",
  "Fair",
  "Art ",
  "Politics",
  "Brown-hair",
  "Red-hair",
  "Computer Science",
  "Tamagotchi",
  "Movies",
  "Sport",
  "Music",
  "Friends",
  "Bar",
  "Party",
  "Books",
  "Mangas",
  "Social media",
  "Youtube",
  "Video games",
  "Car",
  "Vegan",
  "Yoga",
  "Jewellery"
];

faker.locale = "fr";

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getUserCoordinatesByCity = async city => {
  return await opencage
    .geocode({
      q: `${city}`,
      key: odg_api_key
    })
    .then(data => {
      let coordinates = {};
      if (data.status.code == 200 && data.results.length > 0) {
        coordinates.lat = data.results[0].geometry.lat;
        coordinates.lon = data.results[0].geometry.lng;
      }
      return coordinates;
    })
    .catch(e => {
      console.error(e.stack);
    });
};

const createAdminAccount = async () => {
  const userId = "eef7d602-045f-4db3-92e2-afd6131f5a41";
  const { lat, lon } = await getUserCoordinatesByCity("Paris");
  const query = `
    INSERT INTO users (user_id,mail,user_name,last_name,first_name,birthday,password_hash,gender,orientation,presentation,score,city,latitude,longitude,last_connection,validated_account) VALUES ('${userId}', 'matcha.gestion@gmail.com', 'IAmAnAdmin', 'AnAdmin', 'IAm', 'Mar/01/1996', '$2b$10$tdIkGSVR6yK/BOXS.CPrleN7pMgzs/R7o8MtMj.RdlfmZWPrJiQIi', 'Woman', 'Both', 'I think I am an admin user so you do whatever you want and I judge you really hard !\nHello my lovely proofreader (;', 100, 'Paris', '${lat}', '${lon}', '${Math.floor(
    Date.now()
  )}', TRUE);
    INSERT INTO profile_picture (user_id, path, date, main) VALUES ('${userId}', 'memecat.jpg', '1563832800', TRUE), ('${userId}', 'tchoupi.jpg', '1563832800', FALSE);
    INSERT INTO user_tag (tag_id, user_id) VALUES ('8', '${userId}'), ('14', '${userId}');
  `;
  await pool.query(query);
  return userId;
};

pgtools
  .dropdb({ user, host: "localhost", password, port: 5432 }, "matcha")
  .then(() => {
    console.log("Old database dropped\nSetting up new database");
    pgtools
      .createdb({ user, host: "localhost", password, port: 5432 }, "matcha")
      .then(() => {
        console.log("New database set up\nPopulating with columns");
        pool
          .query(sql)
          .then(async () => {
            console.log("Populating with new fakes profiles");
            const cities = await Axios(
              "https://randomuser.me/api/?results=500&nat=fr&inc=location"
            )
              .then(({ data: { results } }) => {
                let cities = [];
                for (let i = 0; i < results.length; i++) {
                  cities.push({
                    city:
                      results[i].location.city === "Orléans"
                        ? "Paris"
                        : capitalizeFirstLetter(results[i].location.city)
                  });
                }
                return cities;
              })
              .catch(e => {
                console.error(e.stack);
              });
            const adminUserId = await createAdminAccount();
            for (let i = 0; i < 20; i++) {
              const indexPicture = Math.floor(Math.random() * pictures.length);
              const indexPicture2 = Math.floor(Math.random() * pictures.length);
              const indexTag = Math.floor(Math.random() * tags.length);
              const indexTag2 = Math.floor(Math.random() * tags.length);
              const indexCity = Math.floor(Math.random() * cities.length);
              const picturePath = pictures[indexPicture];
              const picturePath2 = pictures[indexPicture2];
              const userId = faker.random.uuid();
              const firstName = faker.name.firstName();
              const lastName = faker.name.lastName();
              const userName = firstName + lastName;
              const birthdayDate = faker.date
                .between("1919-12-31", "2001-01-01")
                .toString()
                .split(" ");
              const connectionDate = faker.date
                .between("2019-06-01", "2019-10-01")
                .toString()
                .split(" ");
              const { lat, lon } = await getUserCoordinatesByCity(
                cities[indexCity].city
              );
              let query = `INSERT INTO users (user_id,mail,user_name,last_name,first_name,birthday,password_hash,gender,orientation,presentation,score,city,latitude,longitude,last_connection,validated_account) VALUES ('${userId}', '${faker.internet.email()}', '${userName}', '${lastName}', '${firstName}', '${birthdayDate[1] +
                "/" +
                birthdayDate[2] +
                "/" +
                birthdayDate[3]}', '${faker.random.uuid()}', '${faker.random.arrayElement(
                ["Woman", "Man", "Other"]
              )}', '${faker.random.arrayElement([
                "Woman",
                "Man",
                "Other",
                "Both"
              ])}', ${escape.literal(
                faker.random.words(20)
              )}, ${faker.random.number(100)}, ${escape.literal(
                cities[indexCity].city
              )}, '${lat}', '${lon}', '${new Date(
                connectionDate[3] +
                  "/" +
                  connectionDate[1] +
                  "/" +
                  connectionDate[2]
              ).getTime()}', TRUE);
              INSERT INTO profile_picture (user_id, path, date, main) VALUES ('${userId}', '${picturePath}', '1563832800', TRUE), ('${userId}', '${picturePath2}', '1563832800', FALSE);
              INSERT INTO user_tag (tag_id, user_id) VALUES ('${indexTag}','${userId}'), ('${indexTag2}', '${userId}');`;
              if (i % 2 === 0) {
                query =
                  query +
                  `INSERT INTO user_visit (visiting_user_id, visited_user_id, date) VALUES ('${userId}', '${adminUserId}', '${new Date(
                    connectionDate[3] +
                      "/" +
                      connectionDate[1] +
                      "/" +
                      connectionDate[2]
                  ).getTime()}');
                    INSERT INTO user_like (liking_user_id, liked_user_id, date) VALUES ('${userId}', '${adminUserId}', '${new Date(
                    connectionDate[3] +
                      "/" +
                      connectionDate[1] +
                      "/" +
                      connectionDate[2]
                  ).getTime()}')`;
              }
              await pool.query(query);
            }
          })
          .then(() => {
            console.log("Database populated\nAll done");
            pool.end();
          })
          .catch(e => {
            console.error(e.stack);
          });
      })
      .catch(e => {
        console.error(e.stack);
      });
  })
  .catch(e => {
    console.error(e.stack);
  });
