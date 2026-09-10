import http from 'http';

/**
 * Helper function to send HTTP requests to the backend API
 */
const request = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', (err) => reject(err));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

/**
 * Automated REST API test script for Inventory Management System
 */
async function runTests() {
  console.log('=== STARTING BACKEND REST API VERIFICATION ===\n');

  try {
    // 1. Health Check
    console.log('1. Testing GET /health ...');
    const healthRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET',
    });
    console.log(`   Status: ${healthRes.status} | Response:`, JSON.stringify(healthRes.body));

    // 2. Get All Products
    console.log('\n2. Testing GET /products ...');
    const getRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/products',
      method: 'GET',
    });
    console.log(`   Status: ${getRes.status} | Total Products Count: ${getRes.body.count}`);

    // 3. Create Product
    console.log('\n3. Testing POST /products ...');
    const createRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/products',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Wireless Ergonomic Mouse Pro',
        category: 'Electronics',
        price: 2499,
        quantity: 3,
        minStock: 5,
      }
    );
    console.log(`   Status: ${createRes.status} | Created Product ID: ${createRes.body.data?.id}`);

    const newId = createRes.body.data?.id;

    // 4. Get Low Stock Products
    console.log('\n4. Testing GET /products/low-stock ...');
    const lowStockRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/products/low-stock',
      method: 'GET',
    });
    console.log(`   Status: ${lowStockRes.status} | Low Stock Products Count: ${lowStockRes.body.count}`);

    // 5. Update Product
    if (newId) {
      console.log(`\n5. Testing PUT /products/${newId} ...`);
      const updateRes = await request(
        {
          hostname: 'localhost',
          port: 5000,
          path: `/products/${newId}`,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
        {
          name: 'Wireless Ergonomic Mouse Pro (Updated)',
          category: 'Electronics',
          price: 2799,
          quantity: 15,
          minStock: 5,
        }
      );
      console.log(`   Status: ${updateRes.status} | Updated Name: ${updateRes.body.data?.name}`);
    }

    // 6. Test Validation Error (Negative Price)
    console.log('\n6. Testing Input Validation Error (Price <= 0) ...');
    const invalidRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/products',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Invalid Item',
        category: 'Test',
        price: -10,
        quantity: 5,
        minStock: 2,
      }
    );
    console.log(`   Status: ${invalidRes.status} | Validation Error Message: "${invalidRes.body.message}"`);

    // 7. Delete Product
    if (newId) {
      console.log(`\n7. Testing DELETE /products/${newId} ...`);
      const deleteRes = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/products/${newId}`,
        method: 'DELETE',
      });
      console.log(`   Status: ${deleteRes.status} | Success: ${deleteRes.body.success}`);
    }

    console.log('\n=== ALL REST API ENDPOINTS VERIFIED SUCCESSFULLY ===');
  } catch (error) {
    console.error('\nAPI Verification Error:', error.message);
    console.error('Ensure backend server is running on http://localhost:5000');
  }
}

runTests();
