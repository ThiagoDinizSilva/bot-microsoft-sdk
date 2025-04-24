import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const logger = console;
app.use(bodyParser.json());

// Start the server
app.listen(process.env.port || process.env.PORT || 3978, () => {
    logger.info({ message: `Server listening on http://localhost:${process.env.PORT || 3978}` });
    logger.info({ message: 'To talk to your bot, open the emulator and select "Open Bot"' });
});

export default app;
