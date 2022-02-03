const express = require('express');
const app = express();
const path = require(`path`)

app.use(express.json());

app.use('/static', express.static(`public`));

app.set(`view engine`, `ejs`);
const port = 3000;

app.set(`calendar`, null);

const scheduleRouter = require(`./routes/schedule`);
app.use(`/`, scheduleRouter.router);


app.listen(port, async () => {
    console.log(`Listening for connections at http://localhost:${port}`);
    await scheduleRouter.updateCalendar();
    setInterval(async () => {
        await scheduleRouter.updateCalendar();
    }, 900000);
})