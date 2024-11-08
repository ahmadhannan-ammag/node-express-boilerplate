// // elasticsearch.js
// const { Client } = require('@elastic/elasticsearch');

// const client = new Client({
//   node: 'http://localhost:9200', // Replace with your Elasticsearch server URL
// });
// console.log('Connected to Elasticsearch');

// module.exports = client;





// elasticsearch.js
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://127.0.0.1:9200', // Use IPv4 address
});

module.exports = client;