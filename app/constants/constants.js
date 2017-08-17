module.exports = {
    // query constants
    CREATE_USER_TABLE : 'CREATE table IF NOT EXISTS users(  \n' +
    '  id SERIAL NOT NULL,\n' +
    '  name VARCHAR(20),\n' +
    '  age SMALLINT\n' +
    ');',

    DROP_USER_TABLE : 'DROP TABLE IF EXISTS users CASCADE;',

    CREATE_ACCOUNT_TABLE : 'CREATE TABLE IF NOT EXISTS account( \n' +
    ' user_id SERIAL PRIMARY KEY, \n' +
    ' username VARCHAR(255) UNIQUE NOT NULL, \n' +
    ' email VARCHAR(255) UNIQUE NOT NULL, \n' +
    ' password_hash VARCHAR(255) NOT NULL, \n' +
    ' created_on TIMESTAMP WITHOUT TIME ZONE, \n' +
    ' last_login TIMESTAMP WITHOUT TIME ZONE \n' +
    ');',

    DROP_ACCOUNT_TABLE : 'DROP TABLE IF EXISTS account CASCADE;',

    CREATE_ROLE_TABLE : 'CREATE TABLE role( \n' +
    ' role_id SERIAL PRIMARY KEY, \n' +
    ' role_name VARCHAR(50) UNIQUE NOT NULL \n' +
    ');',

    DROP_ROLE_TABLE : 'DROP TABLE IF EXISTS role CASCADE;',

    CREATE_ACCOUNT_ROLE_TABLE : 'CREATE TABLE account_role( \n' +
    ' user_id INTEGER NOT NULL, \n' +
    ' role_id INTEGER NOT NULL, \n' +
    ' grant_date TIMESTAMP WITHOUT TIME ZONE, \n' +
    ' PRIMARY KEY (user_id, role_id), \n' +
    ' CONSTRAINT account_role_role_id_fkey FOREIGN KEY (role_id) \n' +
    ' REFERENCES role (role_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION, \n' +
    ' CONSTRAINT account_role_user_id_fkey FOREIGN KEY (user_id) \n' +
    ' REFERENCES account (user_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION \n' +
    ');',

    DROP_ACCOUNT_ROLE_TABLE : 'DROP TABLE IF EXISTS account_role;',

    //payload constants
    unauthorized: 'Unauthorized',
    invalid_token: 'missing or invalid authentication token',
    success: 'success',
    account_created: 'account created',
};