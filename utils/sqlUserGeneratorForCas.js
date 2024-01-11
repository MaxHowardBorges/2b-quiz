const { escape } = require('sqlstring');

const queryUser = 'INSERT INTO USERS (uid,psw) VALUES ';
const queryUserAttr = 'INSERT INTO USERATTRS (uid,attrname,attrvalue) VALUES ';

const fs = require('fs');

const users = require('./user.json');
const userSQL = generateSQL(users);

fs.writeFile('user.sql', userSQL, function (err) {
  if (err) {
    console.log(err);
  }
});
function generateSQL(users) {
  let sqlString = '';
  for (let i = 0; i < users.length; i++) {
    sqlString += queryUser + getValueUserFrom(users[i]) + ';\n';
    sqlString += queryUserAttr + getValueUserAttrFrom(users[i]) + ';\n';
  }
  return sqlString;
}

function getValueUserFrom(user) {
  return '(' + escape(user.username) + ',' + escape('azerty') + ')';
}

function getValueUserAttrFrom(user) {
  return (
    '(' +
    escape(user.username) +
    ',' +
    escape('firstname') +
    ',' +
    escape(user.name) +
    '),(' +
    escape(user.username) +
    ',' +
    escape('lastname') +
    ',' +
    escape(user.surname) +
    ')'
  );
}
