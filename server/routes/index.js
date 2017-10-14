const queryController = require('../controllers').query

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Beaker Visualzation Application API!'
  }));

  // query
  app.get('/api/query/lab_status', queryController.getLabStatus);
  app.get('/api/query/test_history', queryController.getTestHistory);
  app.get('/api/query/utilization', queryController.getUtilizationNumbers);

}
