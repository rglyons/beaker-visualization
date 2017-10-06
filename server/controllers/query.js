const Promise = require('bluebird');
const mysql = require('mysql');

function initConnectionPool() {
  console.log("Creating new connection pool instance...");
  var pool  = mysql.createPool({
    connectionLimit : 4,
    host: '10.76.144.103',
    user: 'root',
    password: 'amcc1234',
    database: 'beaker'
  });

  // pool status logging
  pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });
  pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
  });

  return pool
}

function teardownConnectionPool(pool) {
  // close all connections in the pool
  pool.end(function (err) {
    if (err) {
      console.log('POOL END ERROR: ' + err.message);
    }
    console.log('all pool connections have ended.');
  })
}

function execAsyncQuery(pool, query) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log("POOL GET CONNECTION ERROR: " + err.message);
        reject(err);
      } else {
        //resolve(connection);
        console.log('time to query')
        connection.query(
          {
            sql: query,
            timeout: 20000, //20s
          },
          function (err, results, fields) {
            connection.release();   // release DB connection back to the pool
            if (err) {
              console.log("QUERY ERROR: " + err.message);
              reject(err)
            } else {
              //console.log('QUERY RESULTS: ' + results)
              resolve(results)
            }
          });
      }
    })
  })
}


module.exports = {

  getLabStatus(req, res) {
    var pool = initConnectionPool()
    var promises = [
      execAsyncQuery(pool, 'SELECT fqdn, status FROM system WHERE fqdn LIKE \'mustang%\''),
      execAsyncQuery(pool, 'SELECT fqdn, status FROM system WHERE fqdn LIKE \'merlin%\''),
      execAsyncQuery(pool, 'SELECT fqdn, status FROM system WHERE fqdn LIKE \'osprey%\''),
      execAsyncQuery(pool,
        'SELECT d1.id, d2.name FROM distro_tree d1, distro d2 WHERE d1.distro_id=d2.id' )
    ]
    return Promise.all(promises)
      .then(queryData => {
        teardownConnectionPool(pool)
        var mustang = {
          all: queryData[0],
          automated: queryData[0].filter(function(sys){
            return sys.status == 'Automated'
          }),
          broken: queryData[0].filter(function(sys){
            return sys.status == 'Broken'
          }),
          manual: queryData[0].filter(function(sys){
            return sys.status == 'Manual'
          }),
          removed: queryData[0].filter(function(sys){
            return sys.status == 'Removed'
          }),
        };
        var merlin = {
          all: queryData[1],
          automated: queryData[1].filter(function(sys){
            return sys.status == 'Automated'
          }),
          broken: queryData[1].filter(function(sys){
            return sys.status == 'Broken'
          }),
          manual: queryData[1].filter(function(sys){
            return sys.status == 'Manual'
          }),
          removed: queryData[1].filter(function(sys){
            return sys.status == 'Removed'
          }),
        };
        var osprey = {
          all: queryData[2],
          automated: queryData[2].filter(function(sys){
            return sys.status == 'Automated'
          }),
          broken: queryData[2].filter(function(sys){
            return sys.status == 'Broken'
          }),
          manual: queryData[2].filter(function(sys){
            return sys.status == 'Manual'
          }),
          removed: queryData[2].filter(function(sys){
            return sys.status == 'Removed'
          }),
        };
        result = {
          mustang: mustang,
          merlin: merlin,
          osprey: osprey,
          distros: queryData[3]
        }
        // allow CORS for speedy development
        res.set({
          "Access-Control-Allow-Origin": "http://10.76.144.103:8080"
        })
        return res.status(200).send(result)
      })
      .catch(error => {
        console.log(error)
        res.status(400).send(error)
      })
  },

}
