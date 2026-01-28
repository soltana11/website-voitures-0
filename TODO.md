# TODO: Add Database to Car Website Project

## Steps to Complete

- [x] Create `api/init-db.php` to initialize SQLite database, create `cars` table, and migrate existing data from `cars.json`
- [x] Modify `api/getCars.php` to query the database instead of reading JSON file
- [x] Modify `api/save-cars.php` to insert/update/delete cars in the database
- [x] Update `script.js` to load cars from API instead of directly from `cars.json`
- [ ] Test database connection and CRUD operations (requires PHP server)
- [ ] Ensure admin changes persist and appear to users immediately

## Notes
- Using SQLite for lightweight, file-based database.
- Database file: `cars.db` in the project root.
- Table: `cars` with columns: id (primary key), name, year, km, price, image, description, status.
- To initialize the database, run `php api/init-db.php` on a server with PHP (e.g., XAMPP, WAMP, or local server).
- All code changes are complete. Testing requires running the project on a PHP-enabled server.
