# featurehub-webhook-gcp-storage

This is designed to be used in conjunction with `featurehub-webhook-utils`. In
your javascript, use:

```javascript
require('featurehub-webhook-gcp-storage');
```

This is a destination artifact and is designed to be `require`d by your application, which registers a new _type_ called *storage*.

The `storage` type takes two environment variable keys when in use: `BUCKET` and `FOLDER`. If
`FOLDER` is not specified then it will put the artifact in the root of the bucket.

A sample configuration could be:

````shell
DESTINATIONS=featurehub
DESTINATION_FEATUREHUB_TYPE=storage
DESTINATION_FEATUREHUB_BUCKET=featurehub-sdk
````

As is standard, it auto registers the `storage` type as a code as well, so:

````shell
DESTINATIONS=storage
DESTINATION_STORAGE_BUCKET=featurehub-sdk
````

would also work.

