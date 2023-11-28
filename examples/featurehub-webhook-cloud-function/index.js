

const functions = require('@google-cloud/functions-framework');
const {DestinationConfig} = require("featurehub-webhook-utils");

require('featurehub-webhook-gcp-storage');

// Register a CloudEvent function with the Functions Framework
functions.cloudEvent('featurehub', async (cloudEvent) => {
  console.log('cloud event is ', JSON.stringify(cloudEvent));

  if (cloudEvent.type === 'enriched-feature-v1') {
    await (new DestinationConfig()).route(cloudEvent.data);
  }
});
