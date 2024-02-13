const request = require('supertest');
const {app,server} = require('../index');
const bcrypt = require('bcrypt');
const db = require('../db')

//Input a testvalue into database
beforeAll(async () => {
  try {
    const passwordHash = await bcrypt.hash('testPassword', 10);
    await db.query('INSERT INTO users (mobileOrEmail,fullName,username, password) VALUES (?,?,?,?)', ['test@email','testName','testUser', passwordHash]);
  } catch (err) {
    console.error('Setup failed:', err);
    // Optionally, fail the test suite if setup fails
    throw err;
  }
})

afterAll(async () => {
  // Delete test user from database
  await new Promise((resolve, reject) => {
    db.query('DELETE FROM users WHERE username = ?', ['testUser'], (err, result) => {
      if (err) {
        console.error('Cleanup failed:', err);
        return reject(err);
      }
      resolve(result);
    });
  });

  // Properly close the database connection
  await new Promise((resolve, reject) => {
    db.end((err) => {
      if (err) {
        console.error('Failed to close the database connection:', err);
        return reject(err);
      }
      resolve();
    });
  });

  // Close the server to release the port it's listening on
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error('Failed to close server:', err);
        return reject(err);
      }
      resolve();
    });
  });
});


describe('Testing if Login route', () => {
  test('Given successful login with correct credentials', async () => {
    const response = await request(app)
      .post('/')
      .send({
      username: 'testUser',
      password: 'testPassword'
      })
      
      
    expect(response.status).toBe(201)
  })

  //for invalid password/username
  const testScenarios = [
    {
      description: 'Given wrong password',
      requestData: {
        username: 'testUser',
        password: 'wrongPassword',
      },
    },
    {
      description: 'Given wrong username',
      requestData: {
        username: 'nonExistentUser',
        password: 'testPassword',
      },
    },
  ];

  testScenarios.forEach(({ description, requestData }) => {
    test(`${description}`, async () => {
      const response = await request(app)
        .post('/')
        .send(requestData);

      expect(response.statusCode).toBe(401);
      expect(response.text).toContain(`incorrect credentials`);
    });
  });
})