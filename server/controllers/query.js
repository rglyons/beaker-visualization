const Promise = require('bluebird');
const mysql = require('mysql');

function initConnectionPool(nConn) {
  console.log("Creating new connection pool instance with "
              + nConn + " connection(s)...");
  var pool  = mysql.createPool({
    connectionLimit : nConn,
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
    let pool = initConnectionPool(4)
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

  getTestHistory (req, res) {
    let pool = initConnectionPool(1)
    // format query params for sql query
    let boards = req.query.boards.split(',').map((sys) => {
      return '\'' + sys + '\''
    }).toString()
    let distros = req.query.distros.split(',').map((sys) => {
      return '\'' + sys + '\''
    }).toString()
    execAsyncQuery(pool,
      "select RR.fqdn, D.name as distro,\
      	count(case RT.status when 'New' then RT.status else null end) as new, \
      	count(case RT.status when 'Processed' then RT.status else null end) as processed, \
      	count(case RT.status when 'Queued' then RT.status else null end) as queued, \
      	count(case RT.status when 'Scheduled' then RT.status else null end) as scheduled, \
      	count(case RT.status when 'Waiting' then RT.status else null end) as waiting, \
      	count(case RT.status when 'Installing' then RT.status else null end) as installing, \
      	count(case RT.status when 'Running' then RT.status else null end) as running, \
      	count(case RT.status when 'Reserved' then RT.status else null end) as reserved, \
      	count(case RT.status when 'Completed' then RT.status else null end) as completed, \
      	count(case RT.status when 'Cancelled' then RT.status else null end) as cancelled, \
      	count(case RT.status when 'Aborted' then RT.status else null end) as aborted, \
      	count(case RT.result when 'New' then RT.result else null end) as new_result,\
      	count(case RT.result when 'Pass' then RT.result else null end) as pass,\
      	count(case RT.result when 'Warn' then RT.result else null end) as warn,\
      	count(case RT.result when 'Fail' then RT.result else null end) as fail,\
      	count(case RT.result when 'Panic' then RT.result else null end) as panic,\
      	count(case RT.result when 'None' then RT.result else null end) as none,\
      	count(case RT.result when 'Skip' then RT.result else null end) as skip\
      from recipe_task RT \
      	join recipe R on RT.recipe_id=R.id\
      	join recipe_resource RR on RR.recipe_id=RT.recipe_id\
      	join distro_tree DT on R.distro_tree_id=DT.id\
      	join distro D on DT.distro_id=D.id\
      where exists(select RS.id from recipe_set RS where RS.id=R.recipe_set_id \
        and exists(select J.id from job J where RS.job_id=J.id and J.deleted is NULL and J.to_delete is NULL)) \
        and RR.fqdn in (" + boards + ")\
        and D.name in (" + distros + ")\
      group by RR.fqdn, D.name;")
    .then(queryData => {
      teardownConnectionPool(pool)
      let responseObj = {}
      for (let row of queryData) {
        if (!responseObj[row.fqdn]) {
          responseObj[row.fqdn] = []
        }
        let testTotal = row.new + row.processed + row.queued + row.scheduled +
                    row.waiting + row.installing + row.running + row.reserved +
                    row.completed + row.cancelled + row.aborted;
        responseObj[row.fqdn].push({
          'Operating System': row.distro,
          'Status New (ct)': row.new.toString(),
          'Status Processed (ct)': row.processed.toString(),
          'Status Queued (ct)': row.queued.toString(),
          'Status Scheduled (ct)': row.scheduled.toString(),
          'Status Waiting (ct)': row.waiting.toString(),
          'Status Installing (ct)': row.installing.toString(),
          'Status Running (ct)': row.running.toString(),
          'Status Reserved (ct)': row.reserved.toString(),
          'Status Completed (ct)': row.completed.toString(),
          'Status Cancelled (ct)': row.cancelled.toString(),
          'Status Aborted (ct)': row.aborted.toString(),
          'Result New (ct)': row.new_result.toString(),
          'Result Pass (ct)': row.pass.toString(),
          'Result Warn (ct)': row.warn.toString(),
          'Result Fail (ct)': row.fail.toString(),
          'Result Panic (ct)': row.panic.toString(),
          'Result None (ct)': row.none.toString(),
          'Result Skip (ct)': row.skip.toString(),
          'Result New (%)': Math.round(row.new / testTotal * 100) + '%',
          'Result Pass (%)': Math.round(row.pass / testTotal * 100) + '%',
          'Result Warn (%)': Math.round(row.warn / testTotal * 100) + '%',
          'Result Fail (%)': Math.round(row.fail / testTotal * 100) + '%',
          'Result Panic (%)': Math.round(row.panic / testTotal * 100) + '%',
          'Result None (%)': Math.round(row.none / testTotal * 100) + '%',
          'Result Skip (%)': Math.round(row.skip / testTotal * 100) + '%',
        })
      }
      console.log(queryData)
      // allow CORS for speedy development
      res.set({
        "Access-Control-Allow-Origin": "http://10.76.144.103:8080"
      })
      return res.status(200).send(responseObj)
    })
    .catch(error => {
      console.log(error)
      res.status(400).send(error)
    })
  },

}
