module.exports = {
    // query constants
    CREATE_ROLE_TABLE: 'CREATE TABLE role( \n' +
    ' role_id SERIAL PRIMARY KEY, \n' +
    ' role_name VARCHAR(50) UNIQUE NOT NULL \n' +
    ');',

    DROP_ROLE_TABLE: 'DROP TABLE IF EXISTS role CASCADE;',

    CREATE_ACCOUNT_ROLE_TABLE: 'CREATE TABLE account_role( \n' +
    ' user_id INTEGER NOT NULL, \n' +
    ' role_id INTEGER NOT NULL, \n' +
    ' grant_date TIMESTAMP WITHOUT TIME ZONE, \n' +
    ' PRIMARY KEY (user_id, role_id), \n' +
    ' CONSTRAINT account_role_role_id_fkey FOREIGN KEY (role_id) \n' +
    ' REFERENCES role (role_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION, \n' +
    ' CONSTRAINT account_role_user_id_fkey FOREIGN KEY (user_id) \n' +
    ' REFERENCES account (user_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION \n' +
    ');',

    DROP_ACCOUNT_ROLE_TABLE: 'DROP TABLE IF EXISTS account_role;',

    //pg-promise error codes
    unique_violation: '23505',

    //payload constants
    access_token: 'access_token',
    account_created: 'account created',
    app_initialized: 'App Initialized',

    created: 'Created',

    data: 'data',
    duplicate_user: 'A user with that email already exists.',

    failed: 'Failed',

    invalid_login: 'There was an error with your E-Mail/Password combination. Please try again.',
    invalid_token: 'missing or invalid authentication token',

    login_successful: 'login successful',

    success: 'Success',

    unauthorized: 'Unauthorized',
};