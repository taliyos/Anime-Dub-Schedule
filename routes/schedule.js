const express = require(`express`);
const teamup = require(`../teamUpRequests.js`);
const calendar = require(`../calendar.js`);
const router = express.Router();

router.get(`/`, async(req, res) => {
    var schedule = teamup.updateTeamUp();
    res.render(`schedule.ejs`);
});

router.get(`/calendar`, async(req, res) => {
    // console.log(JSON.stringify(calendar.getCurrentCalendar()));
    res.status(200).send(JSON.stringify(calendar.getCurrentCalendar()));
});

async function updateCalendar() {
    let shows = await teamup.updateTeamUp();
    let cal = await calendar.process(shows.shows);
    return cal;
}

module.exports.router = router;
module.exports.updateCalendar = updateCalendar;