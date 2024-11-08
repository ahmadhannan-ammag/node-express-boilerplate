const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const authController = require("./controllers/authController");
const demoRoute = require("./routes/demo");
const createClient = require("./utils/createClient");
require("dotenv").config();


const client = createClient();



const app = express();
app.use(express.json());




const port = process.env.PORT || 5050;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};


app.post('/index', async (req, res) => {
  try {
    const { body } = req;
    const response = await req.app.locals.elasticClient.index({
      index: 'ahmad',
      body,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await req.app.locals.elasticClient.search({
      index: 'ahmad',
      body: {
        query: {
          match: { _all: q },
        },
      },
    });
    res.json(response.hits.hits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example route to add a document to an index
// app.post('/add-document', async (req, res) => {
//   const { index, id, body } = req.body;

//   try {
//     const result = await client.index({
//       index,
//       id,
//       body,
//     });
//     res.status(200).send(result);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });


// Example route to search documents in an index
// app.get('/search', async (req, res) => {
//   const { index, query } = req.query;

//   try {
//     const result = await client.search({
//       index,
//       body: {
//         query: {
//           match: { message: query },
//         },
//       },
//     });
//     res.status(200).send(result.hits.hits);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(logger); // Logging middleware

// Routes
app.get("/", (req, res) => {
  res.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/demo", authController.verifyToken, demoRoute);

// Error handling middleware
app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`App running on port ${port}.`);
// });




const indexName = 'my_index'; // Replace with your desired index name

// Route to create an index
app.post('/create-index', async (req, res) => {
  try {
    const result = await client.indices.create({
      index: indexName,
    });
    res.status(200).send(result);
  } catch (error) {
    if (error.meta.body.error.type === 'resource_already_exists_exception') {
      res.status(200).send({ message: 'Index already exists' });
    } else {
      res.status(500).send(error);
    }
  }
});

// Route to add a document to an index
app.post('/add-document', async (req, res) => {
  const { id, body } = req.body;

  try {
    const result = await client.index({
      index: indexName,
      id,
      body,
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to search documents in an index
app.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    const result = await client.search({
      index: indexName,
      body: {
        query: {
          match: { message: query },
        },
      },
    });
    res.status(200).send(result.hits.hits);
  } catch (error) {
    res.status(500).send(error);
  }
});





const startServer = async () => {
  try {
    await client.ping();
    console.log('Connectewd to Elasticsearch');
    server = app.listen(port, () => {
      console.log(`Listening to port ${port}`);
    });
  } catch (error) {
    logger.error('Elasticsearch connection failed', error);
    process.exit(1);
  }
};
startServer();