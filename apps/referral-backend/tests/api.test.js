const { createApp } = require("../src/app");
const {
	setupTestDb,
	cleanupTestDb,
	makeRequest,
	createTestReferral,
	createTestReferralMinimal,
	createSingleReferral,
	createReferrals,
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
} = require("./test-utils");

describe("Referral CRUD API", () => {
	let app;
	let req;

	beforeAll(() => {
		setupTestDb();
		app = createApp();
		req = makeRequest(app);
	});

	beforeEach(() => {
		clearDatabase();
	});

	afterAll(() => {
		cleanupTestDb();
	});

	describe("Authentication", () => {
		test("should reject requests without authorization header", async () => {
			const response = await request(app).get("/referrals");
			expect(response.status).toBe(401);
			expect(response.body.error).toBe("Missing or invalid Authorization header");
		});

		test("should reject requests with invalid token", async () => {
			const response = await request(app)
				.get("/referrals")
				.set("Authorization", "Bearer invalid-token");
			expect(response.status).toBe(401);
			expect(response.body.error).toBe("Invalid token");
		});

		test("should accept requests with valid token", async () => {
			const response = await req.get("/referrals");
			expect(response.status).toBe(200);
		});
	});

	describe("POST /referrals (CREATE)", () => {
		test("should create a new referral with all fields", async () => {
			const referralData = createTestReferral();
			const response = await req.post("/referrals").send(referralData);

			expect(response.status).toBe(201);
			expect(response.body).toMatchObject({
				givenName: referralData.givenName,
				surname: referralData.surname,
				email: referralData.email,
				phone: referralData.phone,
				homeNameOrNumber: referralData.homeNameOrNumber,
				street: referralData.street,
				suburb: referralData.suburb,
				state: referralData.state,
				postcode: referralData.postcode,
				country: referralData.country,
				status: referralData.status,
				notes: referralData.notes,
				referredBy: referralData.referredBy,
			});

			expect(response.body.id).toBeDefined();
			expect(response.body.createdAt).toBeDefined();
			expect(response.body.updatedAt).toBeDefined();
			validateReferralResponse(response.body);

			// Verify in database
			const dbReferral = getReferralById(response.body.id);
			expect(dbReferral).toBeTruthy();
			expect(dbReferral.email).toBe(referralData.email);
		});

		test("should create a referral with minimal required fields", async () => {
			const referralData = createTestReferralMinimal();
			const response = await req.post("/referrals").send(referralData);

			expect(response.status).toBe(201);
			expect(response.body.country).toBe("Australia"); // default
			expect(response.body.status).toBe("pending"); // default
			expect(response.body.notes).toBeNull();
			expect(response.body.referredBy).toBeNull();
			validateReferralResponse(response.body);
		});

		test("should create referral with house name instead of number", async () => {
			const referralData = createTestReferral({
				homeNameOrNumber: "The Manor",
				email: "manor@example.com",
			});
			const response = await req.post("/referrals").send(referralData);

			expect(response.status).toBe(201);
			expect(response.body.homeNameOrNumber).toBe("The Manor");
		});

		test("should fail with missing required fields", async () => {
			const testCases = [
				{ field: "givenName", data: { surname: "Doe", email: "test@example.com" }, expectedError: "givenName is required" },
				{ field: "surname", data: { givenName: "John", email: "test@example.com" }, expectedError: "surname is required" },
				{ field: "email", data: { givenName: "John", surname: "Doe" }, expectedError: "email is required" },
				{ field: "phone", data: { givenName: "John", surname: "Doe", email: "test@example.com" }, expectedError: "phone is required" },
				{ field: "homeNameOrNumber", data: createTestReferralMinimal({ homeNameOrNumber: undefined }), expectedError: "homeNameOrNumber is required" },
				{ field: "street", data: createTestReferralMinimal({ street: undefined }), expectedError: "street is required" },
				{ field: "suburb", data: createTestReferralMinimal({ suburb: undefined }), expectedError: "suburb is required" },
				{ field: "state", data: createTestReferralMinimal({ state: undefined }), expectedError: "state is required" },
				{ field: "postcode", data: createTestReferralMinimal({ postcode: undefined }), expectedError: "postcode is required" },
			];

			for (const testCase of testCases) {
				const response = await req.post("/referrals").send(testCase.data);
				expect(response.status).toBe(400);
				expect(response.body.error).toBe(testCase.expectedError);
			}
		});

		test("should fail with invalid email format", async () => {
			const referralData = createTestReferral({ email: "invalid-email" });
			const response = await req.post("/referrals").send(referralData);

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Invalid email format");
		});

		test("should fail with invalid status", async () => {
			const referralData = createTestReferral({ status: "invalid-status" });
			const response = await req.post("/referrals").send(referralData);

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Invalid status. Must be one of: pending, contacted, completed, declined");
		});

		test("should fail with duplicate email", async () => {
			const referralData = createTestReferral();
			
			// Create first referral
			await req.post("/referrals").send(referralData);
			
			// Try to create second with same email
			const response = await req.post("/referrals").send({
				...referralData,
				givenName: "Different Name"
			});

			expect(response.status).toBe(409);
			expect(response.body.error).toBe("Email already exists");
		});
	});

	describe("GET /referrals (LIST)", () => {
		test("should return empty list when no referrals exist", async () => {
			const response = await req.get("/referrals");

			expect(response.status).toBe(200);
			expect(response.body.referrals).toEqual([]);
			expect(response.body.pagination).toEqual({
				total: 0,
				limit: 50,
				offset: 0,
				hasMore: false,
			});
			validateReferralListResponse(response.body);
		});

		test("should return all referrals ordered by creation date", async () => {
			// Create multiple referrals
			const referrals = await createReferrals(app, [
				testReferrals.pending(),
				testReferrals.contacted(),
				testReferrals.completed(),
			]);

			const response = await req.get("/referrals");

			expect(response.status).toBe(200);
			expect(response.body.referrals).toHaveLength(3);
			expect(response.body.pagination.total).toBe(3);
			expect(response.body.pagination.hasMore).toBe(false);
			validateReferralListResponse(response.body);

			// Should be ordered by creation date (newest first)
			const emails = response.body.referrals.map(r => r.email);
			expect(emails).toEqual([
				"completed@example.com",
				"contacted@example.com", 
				"pending@example.com",
			]);
		});

		test("should filter referrals by status", async () => {
			await createReferrals(app, [
				testReferrals.pending(),
				testReferrals.contacted(),
				testReferrals.completed(),
				testReferrals.declined(),
			]);

			const response = await req.get("/referrals?status=pending");

			expect(response.status).toBe(200);
			expect(response.body.referrals).toHaveLength(1);
			expect(response.body.referrals[0].status).toBe("pending");
			expect(response.body.pagination.total).toBe(1);
		});

		test("should handle pagination correctly", async () => {
			// Create 5 referrals
			const referralData = [];
			for (let i = 0; i < 5; i++) {
				referralData.push(createTestReferral({ email: `test${i}@example.com` }));
			}
			await createReferrals(app, referralData);

			// Test first page
			const page1 = await req.get("/referrals?limit=2&offset=0");
			expect(page1.status).toBe(200);
			expect(page1.body.referrals).toHaveLength(2);
			expect(page1.body.pagination).toEqual({
				total: 5,
				limit: 2,
				offset: 0,
				hasMore: true,
			});

			// Test second page
			const page2 = await req.get("/referrals?limit=2&offset=2");
			expect(page2.status).toBe(200);
			expect(page2.body.referrals).toHaveLength(2);
			expect(page2.body.pagination).toEqual({
				total: 5,
				limit: 2,
				offset: 2,
				hasMore: true,
			});

			// Test last page
			const page3 = await req.get("/referrals?limit=2&offset=4");
			expect(page3.status).toBe(200);
			expect(page3.body.referrals).toHaveLength(1);
			expect(page3.body.pagination).toEqual({
				total: 5,
				limit: 2,
				offset: 4,
				hasMore: false,
			});
		});
	});

	describe("GET /referrals/:id (GET SINGLE)", () => {
		test("should return single referral by ID", async () => {
			const referral = await createSingleReferral(app);
			const response = await req.get(`/referrals/${referral.id}`);

			expect(response.status).toBe(200);
			expect(response.body.id).toBe(referral.id);
			expect(response.body.email).toBe(referral.email);
			validateReferralResponse(response.body);
		});

		test("should return 404 for non-existent referral", async () => {
			const response = await req.get("/referrals/999");

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Referral not found");
		});
	});

	describe("PATCH /referrals/:id (UPDATE)", () => {
		test("should update referral with partial data", async () => {
			const referral = await createSingleReferral(app, { status: "pending" });
			
			const updateData = {
				status: "contacted",
				notes: "Called on Monday",
			};

			const response = await req.patch(`/referrals/${referral.id}`).send(updateData);

			expect(response.status).toBe(200);
			expect(response.body.status).toBe("contacted");
			expect(response.body.notes).toBe("Called on Monday");
			expect(response.body.email).toBe(referral.email); // unchanged
			expect(response.body.updatedAt).not.toBe(referral.updatedAt); // should be updated
			validateReferralResponse(response.body);

			// Verify in database
			const dbReferral = getReferralById(referral.id);
			expect(dbReferral.status).toBe("contacted");
			expect(dbReferral.notes).toBe("Called on Monday");
		});

		test("should update all fields", async () => {
			const referral = await createSingleReferral(app);
			
			const updateData = createTestReferral({
				email: "updated@example.com",
				givenName: "Updated",
				surname: "Name",
				status: "completed",
			});

			const response = await req.patch(`/referrals/${referral.id}`).send(updateData);

			expect(response.status).toBe(200);
			expect(response.body.email).toBe("updated@example.com");
			expect(response.body.givenName).toBe("Updated");
			expect(response.body.surname).toBe("Name");
			expect(response.body.status).toBe("completed");
		});

		test("should update notes to null", async () => {
			const referral = await createSingleReferral(app, { notes: "Original note" });
			
			const response = await req.patch(`/referrals/${referral.id}`).send({ notes: null });

			expect(response.status).toBe(200);
			expect(response.body.notes).toBeNull();
		});

		test("should return 404 for non-existent referral", async () => {
			const response = await req.patch("/referrals/999").send({ status: "contacted" });

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Referral not found");
		});

		test("should fail with invalid status", async () => {
			const referral = await createSingleReferral(app);
			
			const response = await req.patch(`/referrals/${referral.id}`).send({ 
				status: "invalid-status" 
			});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Invalid status. Must be one of: pending, contacted, completed, declined");
		});

		test("should fail with invalid email format", async () => {
			const referral = await createSingleReferral(app);
			
			const response = await req.patch(`/referrals/${referral.id}`).send({ 
				email: "invalid-email" 
			});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Invalid email format");
		});

		test("should fail with duplicate email", async () => {
			const referral1 = await createSingleReferral(app, { email: "first@example.com" });
			const referral2 = await createSingleReferral(app, { email: "second@example.com" });
			
			const response = await req.patch(`/referrals/${referral2.id}`).send({ 
				email: "first@example.com" 
			});

			expect(response.status).toBe(409);
			expect(response.body.error).toBe("Email already exists");
		});
	});

	describe("DELETE /referrals/:id (DELETE)", () => {
		test("should delete referral successfully", async () => {
			const referral = await createSingleReferral(app);
			
			const response = await req.delete(`/referrals/${referral.id}`);

			expect(response.status).toBe(204);
			expect(response.body).toEqual({});

			// Verify removal from database
			const dbReferral = getReferralById(referral.id);
			expect(dbReferral).toBeUndefined();

			// Verify count decreased
			const count = getReferralsCount();
			expect(count).toBe(0);
		});

		test("should return 404 for non-existent referral", async () => {
			const response = await req.delete("/referrals/999");

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Referral not found");
		});

		test("should not affect other referrals", async () => {
			const referrals = await createReferrals(app, [
				testReferrals.pending(),
				testReferrals.contacted(),
			]);

			const response = await req.delete(`/referrals/${referrals[0].id}`);
			expect(response.status).toBe(204);

			// Verify other referral still exists
			const remaining = getAllReferrals();
			expect(remaining).toHaveLength(1);
			expect(remaining[0].id).toBe(referrals[1].id);
		});
	});

	describe("Error Handling", () => {
		test("should return 404 for unknown routes", async () => {
			const response = await req.get("/unknown-route");

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Not found");
		});

		test("should handle malformed JSON", async () => {
			const response = await request(app)
				.post("/referrals")
				.set("Authorization", `Bearer ${API_TOKEN}`)
				.send("invalid json");

			expect(response.status).toBe(400);
		});
	});

	describe("Data Integrity", () => {
		test("should preserve data types correctly", async () => {
			const referralData = createTestReferral({
				homeNameOrNumber: "123", // string number
				postcode: "2000", // string
			});

			const referral = await createSingleReferral(app, referralData);

			expect(typeof referral.homeNameOrNumber).toBe("string");
			expect(typeof referral.postcode).toBe("string");
			expect(typeof referral.id).toBe("number");
		});

		test("should handle special characters in text fields", async () => {
			const referralData = createTestReferral({
				givenName: "José",
				surname: "García-Smith",
				notes: "Special chars: àèìòù & 中文 & emoji 😊",
				street: "St. Mary's Road",
			});

			const referral = await createSingleReferral(app, referralData);

			expect(referral.givenName).toBe("José");
			expect(referral.surname).toBe("García-Smith");
			expect(referral.notes).toBe("Special chars: àèìòù & 中文 & emoji 😊");
			expect(referral.street).toBe("St. Mary's Road");
		});
	});
});

// Helper to import request for unauthenticated tests
const request = require("supertest");