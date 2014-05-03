var irc = require('irc'),
    cmd = require('./cmd.js');

cmd.register('say', function (args)
{
    console.log(args);
});

cmd.execute('say', ["Hello, world!"]);
cmd.execute('/say Hello, world!');
cmd.execute('/say "Hello, world!"');
cmd.execute('/hello world');
