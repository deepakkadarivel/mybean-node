const records = [
    {
        id: 1,
        url: 'https://google.com',
        description: 'Google'
    },
    {
        id: 2,
        url: 'https://www.blueprintjs.com',
        description: 'Blueprintjs'
    }
];

module.exports = {
    Query: {
        allRecords: () => records,
    },

    Mutation: {
        createRecord: (_, data) => {
            const newRecord = Object.assign({id: records.length + 1}, data);
            records.push(newRecord);
            return newRecord;
        }
    }
};