const HTTP = require( "http" );
const DNS = require( "dns" );

const info = {
    current: {
        error: null,
        nodes: [],
        lastUpdate: null,
    },
    fixed: {
        error: null,
        nodes: [],
        lastUpdate: null,
    },
    tasks: {
        error: null,
        nodes: [],
        lastUpdate: null,
    },
}

const discover = ( name, store ) => {
    DNS.resolve( name, "A", ( error, addresses ) => {
        if ( error ) {
            store.error = error;
        } else {
            store.error = null;
            store.lastUpdate = new Date();
            store.nodes = addresses;
        }

        setTimeout( discover, 60000, name, store );
    } );
};

process.nextTick( discover, process.env.HOSTNAME, info.current );
process.nextTick( discover, "the-host", info.fixed );
process.nextTick( discover, "tasks.the-host", info.tasks );


const server = HTTP.createServer( ( req, res ) => {
    res.setHeader( "content-type", "application/json" );

    res.statusCode = 200;
    res.end( JSON.stringify( { 
        host: process.env.HOSTNAME,
        info,
    } ) );
} );

server.listen( 80 );
