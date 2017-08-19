var SocketCluster = require('socketcluster').SocketCluster;

var socketCluster = new SocketCluster({
    // The port on which to listen for outside connections/requests
    port: 7075,

    // Number of worker processes
    workers: 32,

    // Number of broker processes
    brokers: 4,

    // A unique name for your app (this is used internally for
    // various things such as the directory name in which to store socket
    // file descriptors) - If you don't provide an appName, SC will
    // generate a random one (UUID v4)
    appName: 'image-resizer',

    // This can be the name of an npm module or a path to a Node.js module
    // to use as the WebSocket server engine.
    // You can now set this to 'uws' for a massive speedup of at least 2x!
    wsEngine: 'ws',

    // An ID to associate with this specific instance of SC
    // this may be useful if you are running an SC app on multiple
    // hosts - You can access the instanceId from the Broker object
    // (inside brokerController) - If you don't provide an instanceId,
    // SC will generate a random one (UUID v4)
    instanceId: null,

    // A key which various SC processes will use to interact with
    // scBroker broker processes securely, defaults to a 256 bits
    // cryptographically random hex string
    secretKey: null,

    // The key which SC will use to encrypt/decrypt authTokens, defaults
    // to a 256 bits cryptographically random hex string
    // The default JWT algorithm used is 'HS256'.
    // If you want to use RSA or ECDSA, you should provide a authPrivateKey
    // and authPublicKey instead of authKey.
    authKey: null,

    // perMessageDeflate compression. Note that if you set it to true, you
    // should also set it to true when instantiating the client socket.
    perMessageDeflate: false,

    // If using an RSA or ECDSA algorithm to sign the authToken, you will need
    // to provide an authPrivateKey and authPublicKey in PEM format (string or Buffer).
    authPrivateKey: null,
    authPublicKey: null,

    // The default expiry for auth tokens in seconds
    authDefaultExpiry: 86400,

    // The algorithm to use to sign and verify JWT tokens.
    authAlgorithm: 'HS256',

    // Crash workers when an error happens - This is the most sensible default
    crashWorkerOnError: true,

    // Reboot workers when they crash - This is a necessity
    // in production but can be turned off for debugging
    rebootWorkerOnCrash: true,

    // Kill/respawn a worker process if its memory consumption exceeds this
    // threshold (in bytes) - If this is null (default), this behavior
    // will be switched off
    killWorkerMemoryThreshold: null,

    // Can be 'http' or 'https'
    protocol: 'http',

    // This is the same as the object provided to Node.js's https server
    protocolOptions: null,

    // This allows you to provide a custom server to use as the underlying HTTP server for SC.
    // This should be the path (string) to your custom HTTP server module.
    // This module needs to export a createServer(protocolOptions) function which should return a customized Node.js HTTP server.
    // The protocolOptions argument passed to the createServer function will be whatever you specify as the protocolOptions above.
    httpServerModule: null,

    // A log level of 3 will log everything, 2 will show notices and errors,
    // 1 will only log errors, 0 will log nothing
    logLevel: 2,

    // In milliseconds, how long a client has to connect to SC before timing out
    connectTimeout: 10000,

    // In milliseconds - If the socket handshake hasn't been completed before
    // this timeout is reached, the new connection attempt will be terminated.
    handshakeTimeout: 10000,

    // In milliseconds, the timeout for calling res(err, data) when
    // your emit() call expects an ACK response from the other side
    // (when callback is provided to emit)
    ackTimeout: 10000,

    // In milliseconds - If the socket cannot upgrade transport
    // within this period, it will stop trying
    socketUpgradeTimeout: 1000,

    // Origins which are allowed to connect to the realtime scServer
    origins: '*:*',

    // The maximum number of unique channels which a single
    // socket can subscribe to
    socketChannelLimit: 1000,

    // The interval in milliseconds on which to
    // send a ping to the client to check that
    // it is still alive
    pingInterval: 25000,

    // How many milliseconds to wait without receiving a ping
    // before closing the socket
    pingTimeout: 60000,

    // Maximum amount of milliseconds to wait before force-killing
    // a process after it was passed a 'SIGTERM' signal
    processTermTimeout: 10000,

    // Whether or not errors from child processes (workers and brokers)
    // should be passed to the current master process
    propagateErrors: true,

    // Whether or not notices from child processes (workers and brokers)
    // should be passed to the current master process
    propagateNotices: true,

    // Whether or not a 'notice' event should be emitted (and logged to console)
    // whenever an action is blocked by a middleware function
    middlewareEmitNotices: true,

    // Lets you specify a host name to bind to - Defaults to
    // 127.0.0.1 (localhost)
    host: null,

    // The path to a file used to bootstrap worker processes
    workerController: __dirname + '/worker.js',

    // The path to a file used to bootstrap broker processes
    brokerController:  __dirname + '/broker.js',

    // The path to a file used to bootstrap either worker or broker process.
    initController: null,

    // By default, SC will reboot all workers when it receives a 'SIGUSR2' signal -
    // This can be used for updating workers with fresh source code in production
    rebootOnSignal: true,

    // If you run your master process (server.js) as super user, this option
    // lets you downgrade worker and broker processes to run under
    // the specified user (with fewer permissions than master) - You can provide
    // a Linux UID or username
    downgradeToUser: false,

    // The URL path reserved by SocketCluster clients to interact with the server
    path: '/',

    // The root directory in which to store your socket files in Linux.
    socketRoot: null,

    // Defaults to "rr", but can be set to "none" - Click here for details.
    schedulingPolicy: 'rr',

    // Whether or not clients are allowed to publish messages to channels
    allowClientPublish: true,

    // By default, when you send a 'kill -SIGUSR2' signal to the master process,
    // it will reboot all workers, you can turn this behavior off by setting this
    // option to false
    rebootOnSignal: true,

    // This option is passed to the Node.js HTTP server if provided
    tcpSynBacklog: null,

    // SC keeps track of request per minutes internally - This allows you to change
    // how often this gets updated
    workerStatusInterval: 10000,

    // The default clustering engine (Node.js module name) which provides the
    // SCWorker.exchange object and manages brokers behind the scenes.
    // You shouldn't need to change this unless you want to build your own
    // process clustering engine (which is difficult to do).
    clusterEngine: 'sc-broker-cluster'
});
