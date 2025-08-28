const cron = require('node-cron');
const HackathonService = require('../hackathon/HackathonService');

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily hackathon status update...');
    try {
        const hackathons = await HackathonService.updateStatus();
        console.log('Hackathon statuses updated:', hackathons.length);
    } catch (err) {
        console.error('Error updating hackathon statuses:', err.message);
    }
});
