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
 * Version:     V2
 * Author:      Joshua Gray
 * Description: Create the example type, and the examples table.
 ******************************************************************************/

/**
 * Type:        api.example_type
 * Author:      Joshua Gray
 * Description: Type for an individual example record.
 * Attributes:  id UUID - Very low probability that a UUID will be duplicated.
 *              name VARCHAR(50) - 50 char limit for display purposes.
 *              date_created TIMESTAMPTZ - 
 *              date_deleted TIMESTAMPTZ - 
 */
CREATE TYPE api.example_type AS (
    id              UUID,
    name            VARCHAR ( 50 ),
    date_created    TIMESTAMPTZ,
    date_deleted    TIMESTAMPTZ
);
COMMENT ON TYPE api.example_type IS 'Type for an individual example record.';

/**
 * Table:       api.examples
 * Author:      Joshua Gray
 * Description: Table to store example records.
 * Columns:     id - Primary key with default using the gen_random_uuid() function.
 *              name - Unique, and not null.
 *              date_created - Not null.
 *              date_deleted - 
 */
CREATE TABLE IF NOT EXISTS api.examples OF api.example_type (
    id            WITH OPTIONS PRIMARY KEY      DEFAULT gen_random_uuid(),
    name          WITH OPTIONS UNIQUE NOT NULL,
    date_created  WITH OPTIONS        NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX examples_name_index ON api.examples (name);
COMMENT ON TABLE api.examples IS 'Table to store example records.';
COMMENT ON COLUMN api.examples.id IS 'UUID primary key.';
COMMENT ON COLUMN api.examples.name IS 'Unique display name.';
COMMENT ON COLUMN api.examples.date_created IS 'Datetime the record was created in the database.';
COMMENT ON COLUMN api.examples.date_deleted IS 'Datetime the record was marked as deleted.';

/**
 * Function:    api.examples_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the examples table.
 * Parameters:  name VARCHAR(50) - Unique display name.
 * Usage:       SELECT * FROM api.examples_create('foo');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION api.examples_create (
    name          VARCHAR( 50 )
)
    RETURNS  SETOF api.examples
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    INSERT
    INTO   api.examples (name)
    VALUES ($1)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION api.examples_create IS 'Function to create a record in the examples table.';

/**
 * Function:    api.examples_read
 * Author:      Joshua Gray
 * Description: Function to read a record by id.
 * Parameters:  id UUID
 * Usage:       SELECT * FROM api.examples_read('00000000-0000-0000-0000-000000000000');
 * Returns:     The record if found.
 */
CREATE OR REPLACE FUNCTION api.examples_read (
    id UUID
)
    RETURNS  SETOF api.examples
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM   api.examples
    WHERE  api.examples.id = $1;
END;
$$;
COMMENT ON FUNCTION api.examples_read IS 'Function to read a record by id.';

/**
 * Function:    api.examples_update
 * Author:      Joshua Gray
 * Description: Function to update a record in the examples table. The id and date_created cannot be
 *              changed.
 * Parameters:  id UUID - Primary key id for the record to be updated.
 *              name VARCHAR( 50 ) - 
 * Usage:       SELECT * FROM api.examples_update('00000000-0000-0000-0000-000000000000', 'foo');
 * Returns:     The record that was updated.
 */
CREATE OR REPLACE FUNCTION api.examples_update (
    id            UUID,
    name          VARCHAR( 50 ) DEFAULT NULL
)
    RETURNS  SETOF api.examples
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    UPDATE api.examples
    SET
        name = COALESCE($2, api.examples.name)
    WHERE api.examples.id = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION api.examples_update IS 'Function to update a record in the examples table.';

/**
 * Function:    api.examples_delete
 * Author:      Joshua Gray
 * Description: Function to delete a record in the examples table (soft delete).
 * Parameters:  id UUID - Primary key id for the record to be deleted.
 * Usage:       SELECT * FROM api.examples_delete('00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was deleted.
 */
CREATE OR REPLACE FUNCTION api.examples_delete (
    id UUID
)
    RETURNS  SETOF api.examples
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    now TIMESTAMPTZ;
BEGIN
    SELECT CURRENT_TIMESTAMP INTO now;

    RETURN QUERY
    UPDATE api.examples
    SET    date_deleted = now
    WHERE  api.examples.id  = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION api.examples_delete IS 'Function to delete a record in the examples table (soft delete).';

/**
 * Function:    api.examples_count_by_column_value
 * Author:      Joshua Gray
 * Description: Function to return the count of example records that match a given column/value.
 * Parameters:  column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM api.examples_count_by_column_value('name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION api.examples_count_by_column_value (
    column_name  TEXT,
    column_value TEXT
)
    RETURNS  integer
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    row_count integer;
    query     text := 'SELECT COUNT(*) FROM api.examples';
BEGIN
    IF column_name IS NOT NULL THEN
        query := query || ' WHERE ' || quote_ident(column_name) || ' = $1';
    END IF;
    EXECUTE query
    USING   column_value
    INTO    row_count;
    RETURN  row_count;
END;
$$;
COMMENT ON FUNCTION api.examples_count_by_column_value IS 'Function to return the count of example records that match a given column/value';
