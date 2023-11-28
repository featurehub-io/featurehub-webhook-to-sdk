#!/bin/bash
curl localhost:3000 \
  -X POST \
  -H "Content-Type: application/json" \
  -H "ce-id: 1234" \
  -H "ce-specversion: 1.0" \
  -H "ce-time: 2023-11-02T12:34:56.789Z" \
  -H "ce-type: enriched-feature-v1" \
  -H "ce-subject: io.featurehub.events.enricher" \
  -H "ce-source: https://appfeaturehub.io" \
  -d @../sample-data/complex.json
