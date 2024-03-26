const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "LearnVerse APIS",
    description: "Documentation about the APIS in our website  ",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js"); // project's root file
});
