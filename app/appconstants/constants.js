module.exports = {
    // query constants
    CREATE_USER_TABLE : 'CREATE table IF NOT EXISTS users(  \n' +
    '  id SERIAL NOT NULL,\n' +
    '  name VARCHAR(20),\n' +
    '  age SMALLINT\n' +
    ');'
};