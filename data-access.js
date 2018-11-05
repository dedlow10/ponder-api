var mysql = require('mysql');

module.exports = {
    getConnection: function() {
        return mysql.createConnection({
            host: "prodmysql.cphdeyoxcjbz.us-east-1.rds.amazonaws.com",
            user: "dedlow",
            password: "Soccer1985",
            database: "DecisionMaker",
            multipleStatements: true,
            typeCast: function castField( field, useDefaultTypeCasting ) {

                // We only want to cast bit fields that have a single-bit in them. If the field
                // has more than one bit, then we cannot assume it is supposed to be a Boolean.
                if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
        
                    var bytes = field.buffer();
        
                    // A Buffer in Node represents a collection of 8-bit unsigned integers.
                    // Therefore, our single "bit field" comes back as the bits '0000 0001',
                    // which is equivalent to the number 1.
                    return( bytes[ 0 ] === 1 );
        
                }
        
                return( useDefaultTypeCasting() );
        
            }
        });
    }
};