# featurehub-webhook-utils

This is the set of utilities for the standard webhook that FeatureHub emits when
a feature changes. It is designed to receive a string or JSON body and then
convert it into a standard SDK format and then passes it onto a destination - usually for saving in a AWS S3 bucket, dynamo db table, GCP Storage bucket or similar.

It is intended to be used in a function based library, and is thus ideal for serverless style deployment such as:

- *AWS Lamba* - an example application is [here](https://github.com/featurehub-io/featurehub-webhook-to-sdk/tree/main/examples/featurehub-webhook-lambda). AWS Lamba comes in many different flavours so we don't bundle this as a standalone application.
- *GCP Cloud Function* - an example application is [here](https://github.com/featurehub-io/featurehub-webhook-to-sdk/tree/main/examples/featurehub-webhook-cloud-function). It can operate as a proper CloudEvent either via https or some delivery mechanism like GCP PubSub. There are many ways and combinations you can use to deliver your webhook to a GCP Cloud Function so this is a simple example.
- *Others* - including Knative Functions (using Knative Eventing for delivery), and other serverless frameworks.

## Further Documentation

More documentation on this library's overall construction is available [here](https://github.com/featurehub-io/featurehub-webhook-to-sdk/tree/main).

## Application Flow

The basic flow of an application using this library is:

```javascript
const {DestinationConfig} = require("featurehub-webhook-utils");

// receive some string body or json body
await (new DestinationConfig()).route(body);
// catch exception and return error code if problem
```

