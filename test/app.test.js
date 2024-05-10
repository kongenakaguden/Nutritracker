const chai = require('chai');
const expect = chai.expect;
const { createUser } = require('../app/views/controllers/createController');
const User = require('../app/views/models/user'); // Correct path as necessary

describe('User Route - createUser', function() {
    let originalCheckUserExists; // This will hold the original function

    // Before each test, store the original function and set up the necessary mock
    beforeEach(() => {
        originalCheckUserExists = User.prototype.checkUserExists; // Store the original function
    });

    // After each test, restore the original function to ensure no test interference
    afterEach(() => {
        User.prototype.checkUserExists = originalCheckUserExists; // Restore the original function
    });

    it('should create a user successfully', async function() {
        // Mock checkUserExists to always return false for this test
        User.prototype.checkUserExists = async () => false;

        const req = {
            body: {
                username: 'newuser12',
                email: 'newuser12@example.com',
                password: 'password123',
                weight: 75,
                age: 30,
                gender: 'male'
            }
        };
        let statusCode, responseBody;
        const res = {
            json: (body) => {
                responseBody = body;
            },
            status: function(code) {
                statusCode = code;
                return this; // Allows chaining
            }
        };

        await createUser(req, res);

        expect(statusCode).to.equal(201);
        expect(responseBody).to.deep.equal({ message: 'User created successfully' });
    });

    it('should handle errors when user already exists', async function() {
        // Mock checkUserExists to always return true for this test
        User.prototype.checkUserExists = async () => true;

        const req = {
            body: {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password123',
                weight: 75,
                age: 30,
                gender: 'male'
            }
        };
        let statusCode, responseBody;
        const res = {
            json: (body) => {
                responseBody = body;
            },
            status: function(code) {
                statusCode = code;
                return this; // Allows chaining
            }
        };

        await createUser(req, res);

        expect(statusCode).to.equal(400);
        expect(responseBody).to.deep.equal({ message: 'User already exists' });
    });
});