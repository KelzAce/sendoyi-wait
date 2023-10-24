const express = require('express');
const AWS = require('aws-sdk');

const app = express();

app.use(express.json());

//config AWS

const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });

const sns = new AWS.SNS({ credentials, region: 'us-east-1' });

//Route
app.get('/status', (req, res) => res.send({ status: 'ok', sns }));

app.post('/subscribe', (req, res) => {
  let params = {
    Protocol: 'EMAIL',
    TopicArn: 'arn:aws:sns:us-east-1:046504469503:SendnawNews',
    Endpoint: req.body.email, // required
  };

  sns.subscribe(params, (err, data) => {
    if (err) console.error(err);
    res.send(data);
  });
});

app.post('/publish', (req, res) => {
  let params = {
    Subject: req.body.subject,
    Message: req.body.message,
    TopicArn: 'arn:aws:sns:us-east-1:046504469503:SendnawNews',
  };

  sns.publish(params, (err, data) => {
    if (err) console.error(err);
    res.send(data);
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`SNS App listening on port ${port}`);
});
