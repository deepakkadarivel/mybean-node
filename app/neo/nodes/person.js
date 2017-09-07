module.exports = {
    // constraints
    SHOULD_EXIST: 'CREATE CONSTRAINT ON (n:Person) ASSERT (n.name, n.email, n.phone, n.password) IS NODE KEY',
    UNIQUE_EMAIL: 'CREATE CONSTRAINT ON (person:Person) ASSERT person.email IS UNIQUE',
    UNIQUE_PHONE: 'CREATE CONSTRAINT ON (person:Person) ASSERT person.phone IS UNIQUE',

    // drop constraints
    DROP_SHOULD_EXIST: 'DROP CONSTRAINT ON (n:Person) ASSERT (n.name, n.email, n.phone, n.password) IS NODE KEY',
    DROP_UNIQUE: 'DROP CONSTRAINT ON (person:Person) ASSERT (person.email, person.phone) IS UNIQUE',

    // query
    ALL_USERS: 'MATCH (person:Person) RETURN person SKIP {skipParam} LIMIT {limitParam}',
    LOGIN: 'MATCH (p:Person {email: {emailParam}}) RETURN p.password AS password LIMIT 1',
    REGISTER: 'MERGE (p:Person {name: {nameParam}, email: {emailParam}, phone: {phoneParam}, password: {passwordParam}}) RETURN p.name AS name',
};