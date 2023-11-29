# featurehub-webhook-aws-s3

This is designed to be used in conjunction with `featurehub-webhook-utils`. In
your javascript, use:

```javascript
require('featurehub-webhook-aws-s3');
```

This is a destination artifact and is designed to be `require`d by your application, which registers a new _type_ called *s3*. 

The s3 type takes two environment variable keys when in use: `BUCKET` and `FOLDER`. If
`FOLDER` is not specified then it will put the artifact in the root of the bucket.

A sample configuration could be:

````shell
DESTINATIONS=featurehub
DESTINATION_FEATUREHUB_TYPE=s3
DESTINATION_FEATUREHUB_BUCKET=featurehub-sdk
````

As is standard, it auto registers the `s3` type as a code as well, so:

````shell
DESTINATIONS=s3
DESTINATION_S3_BUCKET=featurehub-sdk
````

would also work.

