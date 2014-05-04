var irc = require('irc'),
    cmd = require('./cmd.js');

var settings = {
    nickname: process.env.USER,
    username: process.env.USER,
    realname: process.env.USER
}

var servers = [];

cmd.register('print', function (args)
{
    console.log(args);
});

cmd.register('set', function (args)
{
    if (!settings[args[0]])
    {
        console.error('Setting not found: ' + args[0]);
        return;
    }

    if (args[1])
    {
        settings[args[0]] = args.slice(1).join(' ');
    }
    else
    {
        console.log(settings[args[0]]);
    }
});

cmd.register('connect', function (args)
{
    var conn = new irc.Client(args[0], settings.nickname, {
        userName: settings.username,
        realName: settings.realname
    });

    conn.on('raw', function (message)
    {
        console.log(message);
    });

    servers.push(conn);
});

cmd.register('join', function (args)
{
    // args = verify(args, [ Number, String ]); something like this

    servers[args[0]].join(args[1], function ()
    {
        console.log(arguments);
    });
});

cmd.exec('/set nickname dark-');
cmd.exec('/set realname Darkwater using nvirc');
cmd.exec('/set realname');
// cmd.exec('/connect irc.freenode.net');
