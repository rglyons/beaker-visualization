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
          }).sort(function (sys1, sys2) {
            let i = sys1.fqdn.indexOf('rack') + 4
            let j = sys2.fqdn.indexOf('rack') + 4
            return parseInt(sys1.fqdn.substr(i,3)) - parseInt(sys2.fqdn.substr(j,3))
          }), // only sort the data that people are lilely to look at
          manual: queryData[0].filter(function(sys){
            return sys.status == 'Manual'
          }),
          removed: queryData[0].filter(function(sys){
            return sys.status == 'Removed'
          }).sort(function (sys1, sys2) {
            let i = sys1.fqdn.indexOf('rack') + 4
            let j = sys2.fqdn.indexOf('rack') + 4
            return parseInt(sys1.fqdn.substr(i,3)) - parseInt(sys2.fqdn.substr(j,3))
          }),
        };
        var merlin = {
          all: queryData[1],
          automated: queryData[1].filter(function(sys){
            return sys.status == 'Automated'
          }),
          broken: queryData[1].filter(function(sys){
            return sys.status == 'Broken'
          }).sort(function (sys1, sys2) {
            let i = sys1.fqdn.indexOf('rack') + 4
            let j = sys2.fqdn.indexOf('rack') + 4
            return parseInt(sys1.fqdn.substr(i,3)) - parseInt(sys2.fqdn.substr(j,3))
          }),
          manual: queryData[1].filter(function(sys){
            return sys.status == 'Manual'
          }),
          removed: queryData[1].filter(function(sys){
            return sys.status == 'Removed'
          }).sort(function (sys1, sys2) {
            let i = sys1.fqdn.indexOf('rack') + 4
            let j = sys2.fqdn.indexOf('rack') + 4
            return parseInt(sys1.fqdn.substr(i,3)) - parseInt(sys2.fqdn.substr(j,3))
          }),
        };
        var osprey = {
          all: queryData[2],
          automated: queryData[2].filter(function(sys){
            return sys.status == 'Automated'
          }),
          broken: queryData[2].filter(function(sys){
            return sys.status == 'Broken'
          }).sort(function (sys1, sys2) {
            let i = sys1.fqdn.indexOf('rack') + 4
            let j = sys2.fqdn.indexOf('rack') + 4
            return parseInt(sys1.fqdn.substr(i,3)) - parseInt(sys2.fqdn.substr(j,3))
          }),
          manual: queryData[2].filter(function(sys){
            return sys.status == 'Manual'
          }),
          removed: queryData[2].filter(function(sys){
            return sys.status == 'Removed'
          }).sort(function (sys1, sys2) {
            let i = sys1.fqdn.indexOf('rack') + 4
            let j = sys2.fqdn.indexOf('rack') + 4
            return parseInt(sys1.fqdn.substr(i,3)) - parseInt(sys2.fqdn.substr(j,3))
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
      	count(case J.status when 'New' then J.status else null end) as new, \
      	count(case J.status when 'Processed' then J.status else null end) as processed, \
      	count(case J.status when 'Queued' then J.status else null end) as queued, \
      	count(case J.status when 'Scheduled' then J.status else null end) as scheduled, \
      	count(case J.status when 'Waiting' then J.status else null end) as waiting, \
      	count(case J.status when 'Installing' then J.status else null end) as installing, \
      	count(case J.status when 'Running' then J.status else null end) as running, \
      	count(case J.status when 'Reserved' then J.status else null end) as reserved, \
      	count(case J.status when 'Completed' then J.status else null end) as completed, \
      	count(case J.status when 'Cancelled' then J.status else null end) as cancelled, \
      	count(case J.status when 'Aborted' then J.status else null end) as aborted, \
      	count(case J.result when 'New' then J.result else null end) as new_result,\
      	count(case J.result when 'Pass' then J.result else null end) as pass,\
      	count(case J.result when 'Warn' then J.result else null end) as warn,\
      	count(case J.result when 'Fail' then J.result else null end) as fail,\
      	count(case J.result when 'Panic' then J.result else null end) as panic,\
      	count(case J.result when 'None' then J.result else null end) as none,\
      	count(case J.result when 'Skip' then J.result else null end) as skip\
      from recipe_resource RR join recipe R on RR.recipe_id=R.id \
      	join recipe_set RS on R.recipe_set_id=RS.id \
      	join job J on RS.job_id=J.id \
      	join distro_tree DT on R.distro_tree_id=DT.id \
      	join distro D on DT.distro_id=D.id \
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

  getUtilizationNumbers (req, res) {
    let pool = initConnectionPool(2)
    var promises = [
      execAsyncQuery(pool, 'SELECT count(*) as failures FROM job WHERE result=\'Fail\''),
      execAsyncQuery(pool,
        'select LJ.fqdn, S.status as system_status, J.id, J.status as job_status \
        from job J join \
          (select S.fqdn, max(J.id) as latest_job_id \
          from system S join recipe_resource RR on S.fqdn=RR.fqdn \
          join recipe R on RR.recipe_id=R.id join recipe_set RS on R.recipe_set_id=RS.id \
          join job J on RS.job_id=J.id where S.status!=\'Removed\' group by S.fqdn) \
        LJ on LJ.latest_job_id=J.id \
        join system S on LJ.fqdn=S.fqdn \
        order by S.fqdn;'
      )
    ]
    return Promise.all(promises)
    .then(queryData => {
      teardownConnectionPool(pool)
      let valid_util = {
        'New': true, 'Processed': true, 'Queued': true, 'Scheduled': true,
        'Waiting': true, 'Installing': true, 'Running': true, 'Reserved': true
      }
      let util = {
        mustang: { count: 0, utilized: 0 },
        merlin: { count: 0, utilized: 0 },
        osprey: { count: 0, utilized: 0 },
        failureCount: queryData[0][0].failures
      }

      console.log(queryData)

      for (let row of queryData[1]) {
        if (row.fqdn.startsWith('mustang')) {
          util.mustang.count++
          if (row.system_status != 'Broken' && valid_util[row.job_status]) {
            util.mustang.utilized++
          }
        } else if (row.fqdn.startsWith('merlin')) {
          util.merlin.count++
          if (row.system_status != 'Broken' && valid_util[row.job_status]) {
            util.merlin.utilized++
          }
        } else if (row.fqdn.startsWith('osprey')) {
          util.osprey.count++
          if (row.system_status != 'Broken' && valid_util[row.job_status]) {
            util.osprey.utilized++
          }
        }
      }
      // allow CORS for speedy development
      res.set({
        "Access-Control-Allow-Origin": "http://10.76.144.103:8080"
      })
      return res.status(200).send(util)
    })
    .catch(error => {
      console.log(error)
      res.status(400).send(error)
    })
  }

}
