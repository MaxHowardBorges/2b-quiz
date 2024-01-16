const { faker } = require('@faker-js/faker/locale/fr');

const NB_ADMIN = 3;
const NB_TEACHER = 15;
const NB_STUDENT = 80;

const users = generateUser();
const jsonData = JSON.stringify(users);
const fs = require('fs');
fs.writeFile('user.json', jsonData, function (err) {
  if (err) {
    console.log(err);
  }
});
function generateUser() {
  const usersJson = [];
  for (let i = 1; i < NB_ADMIN; i++) {
    usersJson.push(userGenerate('Admin'));
  }
  for (let i = 0; i < NB_TEACHER; i++) {
    usersJson.push(userGenerate('Teacher'));
  }
  for (let i = 0; i < NB_STUDENT; i++) {
    usersJson.push(userGenerate('Student'));
  }
  return usersJson;
}

function userGenerate(userRole) {
  const name = faker.person.firstName();
  const surname = faker.person.lastName();
  const username = faker.internet.userName({
    firstName: name,
    lastName: surname,
  });
  return { name, surname, username, validate: true, userType: userRole };
}
