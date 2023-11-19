const {DestinationConfig} = require("featurehub-webhook-utils");

// load and register s3 type
require('featurehub-webhook-aws');

exports.handler = async (event, context) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  try {
    await (new DestinationConfig()).route(event.body);
    return 200;
  } catch (e) {
    console.error("failed to process", e);
    return 500;
  }
}
