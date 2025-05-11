// Test script for Postman collection

// Common test functions
const testResponseStatus = (status) => {
    pm.test(`Status code is ${status}`, () => {
        pm.response.to.have.status(status);
    });
};

const testResponseTime = (maxTime) => {
    pm.test(`Response time is less than ${maxTime}ms`, () => {
        pm.expect(pm.response.responseTime).to.be.below(maxTime);
    });
};

const testResponseFormat = () => {
    pm.test("Response is JSON", () => {
        pm.response.to.be.json;
    });
};

// Auth tests
const testAuthResponse = () => {
    testResponseStatus(200);
    testResponseTime(1000);
    testResponseFormat();
    
    pm.test("Response has token", () => {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('token');
        pm.expect(jsonData.token).to.be.a('string');
        
        // Store token for future requests
        pm.environment.set('authToken', jsonData.token);
    });
};

// Pizza Places tests
const testPizzaPlaceResponse = () => {
    testResponseStatus(200);
    testResponseTime(1000);
    testResponseFormat();
    
    pm.test("Response has pizza places array", () => {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.be.an('array');
    });
};

// Reviews tests
const testReviewResponse = () => {
    testResponseStatus(200);
    testResponseTime(1000);
    testResponseFormat();
    
    pm.test("Response has review data", () => {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('id');
        pm.expect(jsonData).to.have.property('rating');
        pm.expect(jsonData).to.have.property('comment');
    });
};

// Challenges tests
const testChallengeResponse = () => {
    testResponseStatus(200);
    testResponseTime(1000);
    testResponseFormat();
    
    pm.test("Response has challenge data", () => {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('id');
        pm.expect(jsonData).to.have.property('title');
        pm.expect(jsonData).to.have.property('description');
    });
};

// Polls tests
const testPollResponse = () => {
    testResponseStatus(200);
    testResponseTime(1000);
    testResponseFormat();
    
    pm.test("Response has poll data", () => {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('id');
        pm.expect(jsonData).to.have.property('options');
        pm.expect(jsonData.options).to.be.an('array');
    });
};

// Dietary Needs tests
const testDietaryNeedResponse = () => {
    testResponseStatus(200);
    testResponseTime(1000);
    testResponseFormat();
    
    pm.test("Response has dietary need data", () => {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('id');
        pm.expect(jsonData).to.have.property('name');
        pm.expect(jsonData).to.have.property('description');
    });
};

// Admin tests
const testAdminResponse = () => {
    testResponseStatus(200);
    testResponseTime(1000);
    testResponseFormat();
    
    pm.test("Response has admin data", () => {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('id');
        pm.expect(jsonData).to.have.property('role');
        pm.expect(jsonData.role).to.equal('admin');
    });
};

// Export test functions
module.exports = {
    testResponseStatus,
    testResponseTime,
    testResponseFormat,
    testAuthResponse,
    testPizzaPlaceResponse,
    testReviewResponse,
    testChallengeResponse,
    testPollResponse,
    testDietaryNeedResponse,
    testAdminResponse
}; 