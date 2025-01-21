const sql = require('mssql');
const msal = require('@azure/msal-node');
require('dotenv').config();

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const msalInstance = new msal.ConfidentialClientApplication(msalConfig);

async function getDbConnection() {
  try {
    const tokenResponse = await msalInstance.acquireTokenByClientCredential({
      scopes: ['https://database.windows.net/.default'],
    });

    const dbConfig = {
      server: process.env.DB_HOST,
      database: process.env.DB_NAME,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
      authentication: {
        type: 'azure-active-directory-access-token',
        options: {
          token: tokenResponse.accessToken,
        },
      },
    };

    const pool = await sql.connect(dbConfig);
    return pool.request();
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err;
  }
}

module.exports = { getDbConnection, sql };
