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
  try {
    await db.query('DELETE FROM users WHERE username = ?', ['testUser']);
    // Check if the connection can be closed
    if (db && db.end) {
      await new Promise((resolve, reject) => {
        db.end((err) => {
          if (err) {
            console.error('Failed to close the database connection:', err);
            return reject(err); // Handle the error as you see fit
          }
          resolve();
        });
      });
    }
  } catch (err) {
    console.error('Teardown failed:', err);
    throw err;
  }


  // Shut down the server
  if (server && server.close) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error('Failed to close the server:', err);
          reject(err);
        } else {
          console.log('Server shut down successfully.');
          resolve();
        }
      });
    });
  }
});

describe('Testing if Login method code is valid', () => {
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