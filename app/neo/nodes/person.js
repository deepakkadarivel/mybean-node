module.exports = {
    // constraints
    SHOULD_PERSON_FIELDS_EXIST: 'CREATE CONSTRAINT ON (person:Person) ASSERT (person.id, person.name, person.email, person.phone, person.password) IS NODE KEY',
    UNIQUE_PERSON_ID: 'CREATE CONSTRAINT ON (person:Person) ASSERT person.id IS UNIQUE',
    UNIQUE_PERSON_EMAIL: 'CREATE CONSTRAINT ON (person:Person) ASSERT person.email IS UNIQUE',
    UNIQUE_PERSON_PHONE: 'CREATE CONSTRAINT ON (person:Person) ASSERT person.phone IS UNIQUE',

    SHOULD_RECORD_FIELDS_EXIST: 'CREATE CONSTRAINT ON (record:Record) ASSERT (record.id, record.url, record.description) IS NODE KEY',
    UNIQUE_RECORD_ID: 'CREATE CONSTRAINT ON (record:Record) ASSERT record.id IS UNIQUE',

    // drop constraints
    DROP_SHOULD_PERSON_FIELDS_EXIST: 'DROP CONSTRAINT ON (n:Person) ASSERT (n.id, n.name, n.email, n.phone, n.password) IS NODE KEY',
    DROP_UNIQUE: 'DROP CONSTRAINT ON (person:Person) ASSERT (person.id, person.email, person.phone) IS UNIQUE',

    // query

    //Person
    ALL_PERSONS: 'MATCH (person:Person) RETURN person SKIP {skip} LIMIT {limit}',
    CREATE_PERSON: 'MERGE (person:Person {id: {id}, name: {name}, email: {email}, phone: {phone}, password: {password}}) RETURN person',
    PERSON_BY_EMAIL: 'MATCH (person:Person {email: {email}}) RETURN person LIMIT 1',
    PERSON_BY_ID: 'MATCH (person:Person {id: {id}}) RETURN person LIMIT 1',

    //Record
    ALL_RECORDS: 'MATCH (record:Record) RETURN record SKIP {skip} LIMIT {limit}',
    CREATE_RECORD: 'MERGE (record:Record {id: {id}, url: {url}, description: {description}, uploadedBy: {uploadedBy}}) RETURN record',
    RELATE_RECORD: 'MATCH (person:Person {id: {id}}),(record:Record {id: {recordId}}) CREATE (person)-[r:UPLOADED]->(record)',
};