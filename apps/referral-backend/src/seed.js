const { db, migrate } = require("./db");

function main() {
  migrate();

  // Clear referrals table
  db.exec(`DELETE FROM referrals;`);

  // Insert sample referrals
  const insertReferral = db.prepare(`
    INSERT INTO referrals 
    (given_name, surname, email, phone, home_name_or_number, street, suburb, state, postcode, country, status, notes, referred_by) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  // Sample referral 1 - Pending
  insertReferral.run(
    "John",
    "Smith",
    "john.smith@example.com",
    "+61412345678",
    "123",
    "Collins Street",
    "Melbourne",
    "Victoria",
    "3000",
    "Australia",
    "pending",
    "Interested in web development course",
    "Sarah Johnson"
  );

  // Sample referral 2 - Contacted
  insertReferral.run(
    "Maria",
    "Garcia",
    "maria.garcia@gmail.com",
    "+61498765432",
    "Unit 5/78",
    "George Street",
    "Sydney",
    "New South Wales",
    "2000",
    "Australia",
    "contacted",
    "Called on Monday, very enthusiastic",
    "Mike Wilson"
  );

  // Sample referral 3 - Completed
  insertReferral.run(
    "David",
    "Chen",
    "david.chen@outlook.com",
    "+61487654321",
    "Greenwood",
    "Oak Avenue",
    "Brisbane",
    "Queensland",
    "4000",
    "Australia",
    "completed",
    "Successfully enrolled in JavaScript course",
    "Online Form"
  );

  // Sample referral 4 - Declined
  insertReferral.run(
    "Emma",
    "Wilson",
    "emma.wilson@yahoo.com",
    "+61456789123",
    "456",
    "High Street",
    "Perth",
    "Western Australia",
    "6000",
    "Australia",
    "declined",
    "Not interested at this time, maybe next year",
    "James Brown"
  );

  // Sample referral 5 - House name instead of number
  insertReferral.run(
    "Robert",
    "Taylor",
    "rob.taylor@icloud.com",
    "+61423456789",
    "The Manor",
    "Victoria Road",
    "Adelaide",
    "South Australia",
    "5000",
    "Australia",
    "pending",
    "Referral from LinkedIn connection",
    "Lisa White"
  );

  console.log("Seeded 5 sample referrals with various statuses and data.");

  // Show what was inserted
  const getAllReferrals = db.prepare(`
    SELECT id, given_name, surname, email, status, created_at 
    FROM referrals 
    ORDER BY created_at DESC
  `);

  const referrals = getAllReferrals.all();
  console.log("\nInserted referrals:");
  console.table(referrals);
}

main();
