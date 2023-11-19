
import * as express from 'express';

const app = express();

process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

app.get('/health/readiness', async (request, response) => {
    response.status(200).send('ok');
});

app.get('/health/liveness', async (request, response) => {
    response.status(200).send('ok');
});

app.post('/featurehub/webhook', async (request, response) => {
    console.log(`received`, JSON.stringify(request.body, null, 2));

    response.status(200);
});

app.listen(parseInt(process.env.PORT || '3000'), () => {
    console.log("Listening on port 3000");
});
