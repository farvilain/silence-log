# silence-log

A tiny framework that provide a log facade, inspired by the Java [SLF4J](http://www.slf4j.org/).


## Motivation

Which log framework would you use when creating your own Node library?
[Bunyan](https://github.com/trentm/node-bunyan) ?
[Winston](https://github.com/winstonjs/winston) ?
[Log](https://www.npmjs.com/package/log) ?
...?

There is no right answer because you try to take a decision not in your scope.

Imagine that John build an application that uses:
* Your framework, using Bunyan
* Another one, using Winston.

John now have to handle differents logging framework.


This framework follow the idea of SLF4J: framework should use an interface and applications decides which implementation they want.


## How does it work?

### Making some logs

After installing `npm install --save silence-log`, you can just do this kind of code.

```javascript

var engineLogger = require('silence-log').get("pegasus.engine");
engineLogger.app({
	name: 'MyApp'
});
engineLogger.warn("engine overheating");

```

The `get` method gives youe the specific logger, creating it if needed. The name provided is hierarchically constructed, with 'dot' separator.
Try to always start your loggers names with your npm project name.

Methods available to log are:
* trace
* debug
* info
* warn
* error

That's it.


### Configurating

In your final application or in your library testing code, you have to provide a configuration to really see your logs.

First of all, require silence-log as soon as possible, to ensure that your installed version will be used event if other dependencies used another one.
Then, require a configuration file.

The easy way is to create a `log.js` file and require it in the first line of your application entry point.


```javascript

var factory = require('silence-log');

function consoleAppender(app, loggerName, level, msg){
	console.log(`${level.toUpperCase().padStart(6, ' ')} [${app.name}] ${loggerName} :: ${msg}`);
}

//Define the root logger appender (and any child) on debug, so for [error, warrn, info, debug] but not trace
factory.get('').addAppender("debug", consoleAppender);

//Remove this appender from anotherFramework (and any child) from info, so [info, debug, trace] but allow it for [error, warn]
factory.get('anotherFramework').removeAppender('info', consoleAppender);

```

### Binding with other framework

It's not yet done but you can provide me help