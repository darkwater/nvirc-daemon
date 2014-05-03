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

// {{{ /nick, /user, /real
cmd.register('nick', function (args)
{
    if (args.length > 0) settings.nickname = args[0];
    else                 console.log(settings.nick);
});

cmd.register('user', function (args)
{
    if (args.length > 0) settings.username = args[0];
    else                 console.log(settings.username);
});

cmd.register('real', function (args)
{
    if (args.length > 0) settings.realname = args.join(' ');
    else                 console.log(settings.realname);
});
// }}}

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

cmd.exec('nick dark-');
cmd.exec('real Darkwater using nvirc');
cmd.exec('connect irc.freenode.net');
setInterval(function () { cmd.exec('join 0 #nvirc') }, 5000);
