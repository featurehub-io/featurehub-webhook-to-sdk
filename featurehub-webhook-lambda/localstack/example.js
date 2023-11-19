

const server = require('../index');

server.handler({body: {
    environment: {
      environment: {
        id: "env-id"
      },
      action: 'CREATE',
      fv: [
        {feature: {id: 'f-id-1', key: 'f-key-1', type: 'BOOLEAN'}, value: {locked: false, version: 1, value: true, rolloutStrategies: []}},
      ]
    }
}});
