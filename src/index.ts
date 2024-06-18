export interface Env {
  ENVIRONMENT: 'production' | 'staging' | 'development';
  SECRET1: string;
  DB_DEV: D1Database;
  DB_STAGE: D1Database;
  DB_PROD: D1Database;
}

export default {
  async fetch(request, env): Promise<Response> {
    let db = env.DB_DEV;
    if (env.ENVIRONMENT === 'staging') {
      db = env.DB_STAGE;
    } else if (env.ENVIRONMENT === 'production') {
      db = env.DB_PROD;
    }

    const { pathname } = new URL(request.url);
    const params = ["Bs Beverages"];

    if (pathname === "/api/beverages") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await db.prepare(
        "SELECT * FROM Customers WHERE CompanyName = ?"
      )
        .bind(...params)
        .all();
      
      // Check the secret value
      results.push({ secret: env.SECRET1 });

      return Response.json(results);
    }

    return new Response(
      "Call /api/beverages to see everyone who works at Bs Beverages"
    );
  },
} satisfies ExportedHandler<Env>;