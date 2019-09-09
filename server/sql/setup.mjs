import pgtools from "pgtools";
import pg from "pg";
import fs from "fs";
import keys from "./dbKeys.json";
import faker from "faker";
import escape from "pg-escape";
import cities from "all-the-cities";

const sql = fs.readFileSync("./sql/setup.sql").toString();
const pictures = fs.readdirSync("./public/fake-pictures/");
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
const { user, password } = keys;
faker.locale = "fr";

const pool = new pg.Pool({
  user: user,
  host: "localhost",
  database: "matcha",
  password: password,
  port: "5432"
});

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
            for (let i = 0; i < 1000; i++) {
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
                .between("2019-06-01", "2019-09-05")
                .toString()
                .split(" ");
              const query = `INSERT INTO users (user_id,mail,user_name,last_name,first_name,birthday,password_hash,gender,orientation,presentation,score,city,last_connection,validated_account) VALUES ('${userId}', '${faker.internet.email()}', '${userName}', '${lastName}', '${firstName}', '${birthdayDate[1] +
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
                cities[indexCity].name
              )}, '${new Date(
                connectionDate[3] +
                  "/" +
                  connectionDate[1] +
                  "/" +
                  connectionDate[2]
              ).getTime() / 1000}', TRUE);
              INSERT INTO profile_picture (user_id, path, date, main) VALUES ('${userId}', '${picturePath}', '1563832800', TRUE), ('${userId}', '${picturePath2}', '1563832800', FALSE);
              INSERT INTO user_tag (tag_id, user_id) VALUES ('${indexTag}','${userId}'), ('${indexTag2}', '${userId}');`;
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
