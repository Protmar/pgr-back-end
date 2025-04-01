/* eslint-disable @typescript-eslint/no-var-requires */
const pg = require('pg');

module.exports = {
  executeQuery: async (pgConfigs, query) => {  

    const client = new pg.Client(pgConfigs)
    client.connect();
  
    try {
      await client.query('BEGIN')
      await client.query(query)
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.end()
    }
  
  }
}  