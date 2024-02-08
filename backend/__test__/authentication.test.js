const request = require('supertest');
const app = require('../index');
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

//removal of test value after testing is complete 
afterAll(async () => {
  try {
    await db.query('DELETE FROM users WHERE username = ?', ['testUser']);
    // Properly close the database connection
    await new Promise((resolve, reject) => {
      db.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  } catch (err) {
    console.error('Teardown failed:', err);
    // Handle cleanup errors, possibly re-throwing to indicate failure
    throw err;
  }
});

describe('Testing if Login method code is valid', () => {
  test('It responds with a JSON token for valid login credentials', async () => {
    const response = await request(app)
      .post('/')
      .send({
      username: 'testUser',
      password: 'testPassword'
      });

    expect(response.body).toHaveProperty('token')
  })

  //for invalid password/username
  const testScenarios = [
    {
      description: 'Wrong password',
      requestData: {
        username: 'testUser',
        password: 'wrongPassword',
      },
    },
    {
      description: 'Wrong username',
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