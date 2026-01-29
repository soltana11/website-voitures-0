-- D1 schema for cars database
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    km INTEGER NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'available'
);
