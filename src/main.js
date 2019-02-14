const randomstring      = require("randomstring");
const Discord 			= require('discord.js');
const client 			= new Discord.Client();
var current_channels    = []


client.login(""); // enter discord bot token here

client.on('ready', () => {
  console.log("Ready");
});

client.on('message', (message)=>{
    createVoice(message);
});

client.on('voiceStateUpdate', (oldMember, newMember) =>{
    for (let i in current_channels){
        let channelName = current_channels[i];
        let voice_channel = oldMember.voiceChannel ? oldMember.voiceChannel.guild.channels.find("name", channelName) : newMember.voiceChannel.guild.channels.find("name", channelName);
        if (IsInVoice(oldMember, channelName) && !IsInVoice(newMember, channelName) && voice_channel.members.size < 1){
            voice_channel.delete()
        };
    };
});


function logChannel(id){
    current_channels.push(id);
};

function IsInVoice(member, name){
    return member.voiceChannel ? member.voiceChannel.name == name : false
};

function createVoice(message){
    let args = message.content.split(" ");
    let cmd = args[0];
    if (cmd == "!createvoice"){
        let mentions = message.mentions ? message.mentions.members.map(member => member.id) : [message.member.id];

        if (!mentions.includes(message.member.id)){
        	mentions.push(message.member.id);
        };

        let current_code = randomstring.generate();
        let guild = message.guild;
        if (!guild.me.permissions.has('MANAGE_CHANNELS')){
        	message.reply("I do not have permissions to complete this action!");
        	return;
        };
        guild.createChannel(current_code, 'voice', [{'id': guild.id, 'deny': 36700160, 'allow': 1024}])
        .then(channel =>{
            logChannel(current_code);
            for (let i in mentions){
	            let member = guild.members.get(mentions[i]);
	            channel.overwritePermissions(member, {
	                CONNECT: true,
	                SPEAK: true,
	                USE_VAD: true
	            });
	        };
    	}).catch(err=>{
            console.error(err);
        });
    };
};
