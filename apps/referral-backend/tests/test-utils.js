const request = require("supertest");
const fs = require("fs");
const path = require("path");

const TEST_DB_PATH = path.join(__dirname, "..", "test.sqlite");
const API_TOKEN = "test-token";

// Test database setup
function setupTestDb() {
  // Remove existing test db
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }

  // Set test environment variables
  process.env.API_TOKEN = API_TOKEN;

  // Since we're using better-sqlite3 which creates the file automatically,
  // we just need to ensure the test environment is set up properly
}

function cleanupTestDb() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
  if (fs.existsSync("data.sqlite")) {
    fs.unlinkSync("data.sqlite");
  }
  if (fs.existsSync("test.sqlite")) {
    fs.unlinkSync("test.sqlite");
  }
}

// Helper to make authenticated requests
function makeRequest(app) {
  return {
    get: (url) =>
      request(app).get(url).set("Authorization", `Bearer ${API_TOKEN}`),
    post: (url) =>
      request(app).post(url).set("Authorization", `Bearer ${API_TOKEN}`),
    patch: (url) =>
      request(app).patch(url).set("Authorization", `Bearer ${API_TOKEN}`),
    delete: (url) =>
      request(app).delete(url).set("Authorization", `Bearer ${API_TOKEN}`),
  };
}

// Test data factories
function createTestReferral(overrides = {}) {
  return {
    givenName: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "+61412345678",
    homeNameOrNumber: "123",
    street: "Test Street",
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "Australia",
    status: "pending",
    notes: "Test referral",
    referredBy: "Test User",
    ...overrides,
  };
}

function createTestReferralMinimal(overrides = {}) {
  return {
    givenName: "Jane",
    surname: "Smith",
    email: "jane.smith@example.com",
    phone: "+61498765432",
    homeNameOrNumber: "456",
    street: "Main Road",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
    ...overrides,
  };
}

function createTestReferralWithHouseName(overrides = {}) {
  return {
    givenName: "Robert",
    surname: "Wilson",
    email: "rob.wilson@example.com",
    phone: "+61487654321",
    homeNameOrNumber: "The Manor",
    street: "Oak Avenue",
    suburb: "Brisbane",
    state: "QLD",
    postcode: "4000",
    country: "Australia",
    status: "contacted",
    notes: "House name instead of number",
    referredBy: "LinkedIn",
    ...overrides,
  };
}

async function createReferrals(app, referralsData = []) {
  const req = makeRequest(app);
  const referrals = [];

  for (const referralData of referralsData) {
    const response = await req
      .post("/referrals")
      .send(createTestReferral(referralData));
    referrals.push(response.body);
  }

  return referrals;
}

async function createSingleReferral(app, referralData = {}) {
  const req = makeRequest(app);
  const response = await req
    .post("/referrals")
    .send(createTestReferral(referralData));
  return response.body;
}

// Database helpers
function clearDatabase() {
  const { db } = require("../src/db");
  db.prepare("DELETE FROM referrals").run();
}

function getReferralById(id) {
  const { db } = require("../src/db");
  return db.prepare("SELECT * FROM referrals WHERE id = ?").get(id);
}

function getAllReferrals() {
  const { db } = require("../src/db");
  return db.prepare("SELECT * FROM referrals ORDER BY created_at DESC").all();
}

function getReferralsByStatus(status) {
  const { db } = require("../src/db");
  return db
    .prepare(
      "SELECT * FROM referrals WHERE status = ? ORDER BY created_at DESC"
    )
    .all(status);
}

function getReferralByEmail(email) {
  const { db } = require("../src/db");
  return db.prepare("SELECT * FROM referrals WHERE email = ?").get(email);
}

function getReferralsCount() {
  const { db } = require("../src/db");
  return db.prepare("SELECT COUNT(*) as count FROM referrals").get().count;
}

// Validation helpers
function validateReferralResponse(referral) {
  const requiredFields = [
    "id",
    "givenName",
    "surname",
    "email",
    "phone",
    "homeNameOrNumber",
    "street",
    "suburb",
    "state",
    "postcode",
    "country",
    "status",
    "createdAt",
    "updatedAt",
  ];

  for (const field of requiredFields) {
    if (referral[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate status values
  const validStatuses = ["pending", "contacted", "completed", "declined"];
  if (!validStatuses.includes(referral.status)) {
    throw new Error(`Invalid status: ${referral.status}`);
  }

  return true;
}

function validateReferralListResponse(response) {
  if (!response.referrals || !Array.isArray(response.referrals)) {
    throw new Error("Response should have referrals array");
  }

  if (!response.pagination) {
    throw new Error("Response should have pagination object");
  }

  const requiredPaginationFields = ["total", "limit", "offset", "hasMore"];
  for (const field of requiredPaginationFields) {
    if (response.pagination[field] === undefined) {
      throw new Error(`Missing pagination field: ${field}`);
    }
  }

  // Validate each referral
  response.referrals.forEach(validateReferralResponse);

  return true;
}

// Test data sets for different scenarios
const testReferrals = {
  pending: () =>
    createTestReferral({
      email: "pending@example.com",
      status: "pending",
    }),
  contacted: () =>
    createTestReferral({
      email: "contacted@example.com",
      status: "contacted",
      notes: "Called on Monday",
    }),
  completed: () =>
    createTestReferral({
      email: "completed@example.com",
      status: "completed",
      notes: "Successfully enrolled",
    }),
  declined: () =>
    createTestReferral({
      email: "declined@example.com",
      status: "declined",
      notes: "Not interested at this time",
    }),
  withHouseName: () => createTestReferralWithHouseName(),
  minimal: () => createTestReferralMinimal(),
};

module.exports = {
  setupTestDb,
  cleanupTestDb,
  makeRequest,
  createTestReferral,
  createTestReferralMinimal,
  createTestReferralWithHouseName,
  createReferrals,
  createSingleReferral,
  clearDatabase,
  getReferralById,
  getAllReferrals,
  getReferralsByStatus,
  getReferralByEmail,
  getReferralsCount,
  validateReferralResponse,
  validateReferralListResponse,
  testReferrals,
  API_TOKEN,
};
