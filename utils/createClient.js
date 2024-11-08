const { Client } = require('@elastic/elasticsearch');



const createClient = (type = 'prod') => {
  
    return new Client({
      node: 'https://localhost:9200',
      ssl: {
        rejectUnauthorized: false,
      },
      auth: {
        username: 'elastic',
        password: 'B+CGe2SP+FKkOVDH7O7a',
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  
  
};
module.exports = createClient;
