var irc      = require('irc'),
    tls      = require('tls'),
    fs       = require('fs'),
    cmd      = require('./cmd.js');

var settings = {
    nickname: process.env.USER,
    username: process.env.USER,
    realname: process.env.USER
};

var servers = [];


// {{{ Command definitions

cmd.register('print', function (args) // {{{
{
    console.log(args);
    return true;
}); // }}}

cmd.register('echo', function (args) // {{{
{
    return args.join(' ');
}); // }}}

cmd.register('set', function (args) // {{{
{
    if (!settings[args[0]])
    {
        return 'Setting not found: ' + args[0];
    }

    if (args[1])
    {
        settings[args[0]] = args.slice(1).join(' ');
        return true;
    }
    else
    {
        return args[0] + ' = ' + settings[args[0]];
    }
}); // }}}

cmd.register('connect', function (args) // {{{
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

    return true;
}); // }}}

cmd.register('join', function (args) // {{{
{
    // args = verify(args, [ Number, String ]); something like this

    servers[args[0]].join(args[1], function ()
    {
        console.log(arguments);
    });

    return true;
}); // }}}

cmd.register('say', function (args) // {{{
{
    servers[args[0]].say(args[1], args.slice(2).join(' '));

    return true;
}); // }}}

// }}}


var ssl = {
    key: fs.readFileSync('sslkey.pem'),
    cert: fs.readFileSync('sslcert.pem')
};

var interfaces = {};

interfaces.cli = tls.createServer({
    key:  ssl.key,
    cert: ssl.cert
}, function (conn)
{
    conn.on('data', function (data)
    {
        data.toString().split('\n').forEach(function (line)
        {
            if (line.length < 1) return;

            try
            {
                var result = cmd.exec(line);
                conn.write(result.toString() + '\n');
            }
            catch (e)
            {
                conn.write('error\n');
            }
        });
    });
});

interfaces.cli.listen(3331);
