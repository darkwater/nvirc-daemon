var cmd = module.exports;

var callbacks = {};

cmd.register = function (name, callback)
{
    callbacks[name] = callback;
}

cmd.exec = cmd.execute = function (command, args)
{
    if (!args)
    {
        var input = command,
            buffer = '',
            instring = '',
            quoted = false;

        command = '';
        args = [];

        if (input.charAt(0) == '/') input = input.slice(1);
        
        input += ' ';

        for (var i = 0; i < input.length; i++)
        {
            var c = input.charAt(i);

            if (!instring && c == ' ' && (buffer != '' || quoted)) // Space after argument
            {
                if (!command) command = buffer;
                else          args.push(buffer);

                buffer = '';
                quoted = false;
            }
            else if (!instring && (c == '"' || c == "'")) // Beginning quote
            {
                instring = c;
                quoted = true;
            }
            else if (instring == c) // Ending quote
            {
                instring = '';
            }
            else if (c != ' ' || instring) // Part of argument
            {
                buffer += c;
            }
        }
    }

    if (callbacks[command])
    {
        return callbacks[command](args);
    }
    else
    {
        return 'Command not found: ' + command;
    }
}
