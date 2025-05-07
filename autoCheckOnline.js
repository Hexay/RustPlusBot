console.log('onConnected Event');
/*
    RustPlusBot PLUGIN
    -------------------------------------------------------
    Server Status Check
    statuscheck.connected
*/
const statuscheck_delay = 300, // 5 minutes
    statuscheck_voice = true;

if (this.storage.statuscheck_delay == null) this.storage.statuscheck_delay = statuscheck_delay;
if (this.storage.statuscheck_voice == null) this.storage.statuscheck_voice = statuscheck_voice;
if (!this.task) this.task = null;

if (!this.func) this.func = function() {
    var self = this;
    if (self.task) {
        clearInterval(self.task);
        self.task = null;
    }
    
    if (self.storage.statuscheck_delay > 0) {
        self.task = setInterval(async function() {
            try {
                const data = await self.app.getDetailedInfo();
                
                if (data && data.players) {
                    const players = data.players.split('/')[0];
                    const nexttime = (data.nextDay >= data.nextNight) ? data.nextNight : data.nextDay;
                    const nexttext = (data.nextDay >= data.nextNight) ? 'night' : 'day';
                    
                    const message = `There ${(players != '1') ? 'are' : 'is'} ${players} player${(players != '1') ? 's' : ''} online and the current server time is ${data.time}, with ${nexttime} seconds remaining until ${nexttext}time`;
                    
                    await self.app.sendTeamMessage(message, null, false, self.storage.statuscheck_voice, true);
                }
            } catch (error) {
                console.error('Error in status check:', error);
            }
        }, self.storage.statuscheck_delay * 1000);
    }
};

this.func();