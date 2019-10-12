const HTTP = require( "http" );
const DNS = require( "dns" );

const nodes = new Map();
let resolverError = null;
let lastUpdate = null;

const discover = () => {
    DNS.resolve( process.env.HOSTNAME, "A", ( error, addresses ) => {
        if ( error ) {
            resolverError = error;
        } else {
            lastUpdate = new Date();
            nodes.clear();
            addresses.forEach( ip4 => nodes.set( ip4, true ) );
        }

        setTimeout( discover, 60000 );
    } );
};

process.nextTick( discover );


const server = HTTP.createServer( ( req, res ) => {
    res.setHeader( "content-type", "application/json" );
    if ( resolverError ) {
        res.statusCode = 500;
        res.end( JSON.stringify( { error: resolverError.message } ) );
    } else {
        const result = [];
        for ( const ipv4 of nodes.keys() ) {
            result.push( ipv4 );
        }

        res.statusCode = 200;
        res.end( JSON.stringify( { nodes: result, lastUpdate } ) );
    }
} );

server.listen( 80 );
