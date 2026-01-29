/**
 * Cloudflare Worker for Car Website API
 * Migrated from PHP/SQLite to Workers/D1
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/cars - Fetch all cars
      if (path === '/api/cars' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT id, name, year, km, price, image, description, status FROM cars ORDER BY id'
        ).all();

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // POST /api/cars - Save cars (replace all)
      if (path === '/api/cars' && request.method === 'POST') {
        const cars = await request.json();

        if (!Array.isArray(cars)) {
          return new Response(JSON.stringify({ error: 'Invalid data: expected array' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Begin transaction
        const db = env.DB;
        await db.exec('DELETE FROM cars');

        const stmt = db.prepare(
          'INSERT INTO cars (name, year, km, price, image, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        for (const car of cars) {
          await stmt.bind(
            car.name || '',
            parseInt(car.year) || 0,
            parseInt(car.km) || 0,
            parseInt(car.price) || 0,
            car.image || '',
            car.description || '',
            car.status || 'available'
          ).run();
        }

        return new Response(JSON.stringify({ success: true, message: 'Cars saved successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // PUT /api/cars/:id - Update single car
      if (path.startsWith('/api/cars/') && request.method === 'PUT') {
        const id = path.split('/').pop();
        const car = await request.json();

        const result = await env.DB.prepare(
          'UPDATE cars SET name = ?, year = ?, km = ?, price = ?, image = ?, description = ?, status = ? WHERE id = ?'
        ).bind(
          car.name || '',
          parseInt(car.year) || 0,
          parseInt(car.km) || 0,
          parseInt(car.price) || 0,
          car.image || '',
          car.description || '',
          car.status || 'available',
          parseInt(id)
        ).run();

        if (result.meta.changes === 0) {
          return new Response(JSON.stringify({ error: 'Car not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, message: 'Car updated successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // DELETE /api/cars/:id - Delete single car
      if (path.startsWith('/api/cars/') && request.method === 'DELETE') {
        const id = path.split('/').pop();

        const result = await env.DB.prepare('DELETE FROM cars WHERE id = ?').bind(parseInt(id)).run();

        if (result.meta.changes === 0) {
          return new Response(JSON.stringify({ error: 'Car not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, message: 'Car deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
