/**
 * Database migration.
 * 
 * Using PostgreSQL for database.
 * @see {@link https://www.postgresql.org/ PostgreSQL}
 * 
 * Using Flyway for database migrations.
 * @see {@link https://flywaydb.org/documentation/database/postgresql Flyway}
 */

/*******************************************************************************
 * Migration:   API
 * Version:     V1
 * Author:      Joshua Gray
 * Description: Initialize the API database, creating the schema, and
 *              a function to return table types.
 ******************************************************************************/

/**
 * Schema:      api
 * Author:      Joshua Gray
 * Description: The namespace for API types, tables, and functions.
 */
CREATE SCHEMA IF NOT EXISTS api;
COMMENT ON SCHEMA api IS 'The namespace for API types, tables, and functions.';

/**
 * Grant:       Connect, usage, execute, select/insert/update/delete.
 * Author:      Joshua Gray
 * Description: Grant safe access to the API database user (dbuser).
 */
GRANT CONNECT ON DATABASE apidb TO dbuser;
GRANT USAGE ON SCHEMA api TO dbuser;

ALTER DEFAULT PRIVILEGES
FOR USER dbowner
IN SCHEMA api
GRANT EXECUTE ON FUNCTIONS TO dbuser;

ALTER DEFAULT PRIVILEGES
FOR USER dbowner
IN SCHEMA api
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO dbuser;

/**
 * Function:    api.get_table_types
 * Author:      Joshua Gray
 * Description: Function to return table column types.
 * Parameters:  table_name TEXT - The name of the table without the schema.
 * Usage:       SELECT * FROM api.get_table_types('users');
 * Returns:     column_name, data_type
 */
CREATE OR REPLACE FUNCTION api.get_table_types (table_name TEXT)
    RETURNS TABLE (column_name VARCHAR ( 255 ), data_type VARCHAR ( 255 ))
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS table_information_schema_columns(
        column_name VARCHAR ( 255 ),
        data_type VARCHAR ( 255 )
    ) ON COMMIT DROP;

    INSERT INTO table_information_schema_columns ( column_name, data_type )
    SELECT isc.column_name, isc.data_type
    FROM information_schema.columns as isc
    WHERE isc.table_name = $1;

    RETURN QUERY
    SELECT *
    FROM table_information_schema_columns;
END;
$$;
COMMENT ON FUNCTION api.get_table_types IS 'Function to return table column types.';
