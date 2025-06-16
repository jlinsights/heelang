const Airtable = require("airtable");

// 환경 변수 로드
require("dotenv").config({ path: ".env.local" });

async function testArtistData() {
  try {
    console.log("Testing Airtable Artist connection...");
    console.log("API Key:", process.env.AIRTABLE_API_KEY ? "Set" : "Not set");
    console.log("Base ID:", process.env.AIRTABLE_BASE_ID ? "Set" : "Not set");

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error("Missing Airtable credentials");
    }

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    );

    console.log("\nFetching Artist data...");
    const records = await base("Artists")
      .select({
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      console.log("No artist data found");
      return;
    }

    const fields = records[0].fields;
    console.log("\nArtist data found:");
    console.log("Name:", fields.name || fields.Name);
    console.log("Bio:", fields.bio || fields.Bio);
    console.log("Birth Year:", fields.birthYear || fields.BirthYear);
    console.log("Education:", fields.education || fields.Education);
    console.log("Exhibitions:", fields.exhibitions || fields.Exhibitions);
    console.log("Awards:", fields.awards || fields.Awards);
    console.log("Collections:", fields.collections || fields.Collections);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testArtistData();
