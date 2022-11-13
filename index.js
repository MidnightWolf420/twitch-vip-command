const config = require('./config.json');
const tmi = require('tmi.js');

const client = new tmi.Client({
	options: { debug: false },
    connection: {
        reconnect: true,
        secure: true
    },
	identity: {
		username: config.username,
		password: config.token
	},
	channels: [config.username]
});

function getTimestamp() {
    var now = new Date(new Date().toLocaleString('en-US'));
    var timestamp = `${now.getHours()<10?`0${now.getHours()}`:now.getHours()}:${now.getMinutes()<10?`0${now.getMinutes()}`:now.getMinutes()}:${now.getSeconds()<10?`0${now.getSeconds()}`:now.getSeconds()}`
    return timestamp;
}

client.connect().then(() => {
    console.log("Ready")
}).catch(console.error);

client.on('message', async(channel, tags, message, self) => {
    var args;
    var command
    if(message.startsWith(config.prefix)) {
        args = message.toLowerCase().slice(config.prefix.length).trim().split(/ +/g);
        command = args.shift().toLowerCase();
    }
    if(command == "vip" && config.canVIP.includes(tags["user-id"])) {
        if(args.length > 0) {
            client.vip(channel, args[0]).then((data) => {
                console.log(`<${getTimestamp()}>`, data)
                console.log(`<${getTimestamp()}> @${tags.username}, Successfully Gave VIP To ${args[0]}`)
                client.say(channel, `@${tags.username}, Successfully Gave VIP To ${args[0]}`);
            }).catch((err) => {
                console.log(`<${getTimestamp()}> @${tags.username}, Error: ${err}`)
                client.say(channel, `@${tags.username}, Error: ${err}`);
            });
        } else client.say(channel, `@${tags.username}, Please Include A Username`);
    }
});