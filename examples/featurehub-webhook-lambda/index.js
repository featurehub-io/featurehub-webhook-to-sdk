// we need the basic utility package that does the transforms and serves as the
// registration point for destinations
const {DestinationConfig} = require("featurehub-webhook-utils");

// Now we need to register all the destination "types" - e.g. s3, dynamo-db, etc are all possible
// load and register s3 type
require('featurehub-webhook-aws-s3');

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
