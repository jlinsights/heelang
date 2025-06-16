const Airtable = require("airtable");
require("dotenv").config({ path: ".env.local" });

async function testAirtableConnection() {
  console.log("🔍 Testing Airtable connection...");

  // 환경 변수 확인
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    console.error("❌ Missing environment variables:");
    console.error("AIRTABLE_API_KEY:", apiKey ? "✅ Set" : "❌ Missing");
    console.error("AIRTABLE_BASE_ID:", baseId ? "✅ Set" : "❌ Missing");
    return;
  }

  console.log("✅ Environment variables found");
  console.log("API Key:", apiKey.substring(0, 10) + "...");
  console.log("Base ID:", baseId);

  try {
    // Airtable 인스턴스 생성
    const airtable = new Airtable({ apiKey });
    const base = airtable.base(baseId);

    console.log("\n📚 Testing Artworks table...");

    // 작품 데이터 가져오기 (최대 3개)
    const artworkRecords = await base("Artworks")
      .select({
        maxRecords: 3,
        sort: [{ field: "year", direction: "desc" }],
      })
      .all();

    console.log(`Found ${artworkRecords.length} artwork records`);

    if (artworkRecords.length > 0) {
      console.log("\n🎨 Sample artwork record:");
      const sample = artworkRecords[0];
      console.log("ID:", sample.id);
      console.log("Fields:", Object.keys(sample.fields));
      console.log("Sample data:", {
        title: sample.fields.title || sample.fields.Title,
        year: sample.fields.year || sample.fields.Year,
        medium: sample.fields.medium || sample.fields.Medium,
        description: sample.fields.description || sample.fields.Description,
        tags: sample.fields.tags || sample.fields.Tags,
      });
    }

    // Artists 테이블 테스트 (복수형)
    console.log("\n👨‍🎨 Testing Artists table...");
    try {
      const artistRecords = await base("Artists")
        .select({
          maxRecords: 1,
        })
        .all();

      console.log(
        `Found ${artistRecords.length} artist records in Artists table`
      );

      if (artistRecords.length > 0) {
        console.log("\n🎭 Sample artist record from Artists table:");
        const sample = artistRecords[0];
        console.log("ID:", sample.id);
        console.log("Fields:", Object.keys(sample.fields));
        console.log("Sample data:", {
          name: sample.fields.name || sample.fields.Name,
          bio: sample.fields.bio || sample.fields.Bio,
          email: sample.fields.email || sample.fields.Email,
          id: sample.fields.id || sample.fields.ID,
        });
      }
    } catch (error) {
      console.error("❌ Artists table access failed:", error.message);
      if (error.statusCode) {
        console.error("Status Code:", error.statusCode);
      }

      // Artist 테이블 테스트 (단수형)
      console.log("\n👨‍🎨 Testing Artist table (singular)...");
      try {
        const artistRecords = await base("Artist")
          .select({
            maxRecords: 1,
          })
          .all();

        console.log(
          `Found ${artistRecords.length} artist records in Artist table`
        );

        if (artistRecords.length > 0) {
          console.log("\n🎭 Sample artist record from Artist table:");
          const sample = artistRecords[0];
          console.log("ID:", sample.id);
          console.log("Fields:", Object.keys(sample.fields));
          console.log("Sample data:", {
            name: sample.fields.name || sample.fields.Name,
            bio: sample.fields.bio || sample.fields.Bio,
            email: sample.fields.email || sample.fields.Email,
            id: sample.fields.id || sample.fields.ID,
          });
        }
      } catch (error2) {
        console.error("❌ Artist table access also failed:", error2.message);
        if (error2.statusCode) {
          console.error("Status Code:", error2.statusCode);
        }
      }
    }

    // 베이스 메타데이터 확인 시도
    console.log("\n📋 Attempting to list available tables...");
    try {
      // Airtable API를 통해 베이스 스키마 정보 가져오기
      const response = await fetch(
        `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.ok) {
        const metadata = await response.json();
        console.log("Available tables:");
        metadata.tables.forEach((table) => {
          console.log(`- ${table.name} (ID: ${table.id})`);
          console.log(
            `  Fields: ${table.fields.map((f) => f.name).join(", ")}`
          );
        });
      } else {
        console.log("Could not fetch base metadata");
      }
    } catch (metaError) {
      console.log("Could not fetch base metadata:", metaError.message);
    }

    console.log("\n✅ Airtable connection test completed!");
  } catch (error) {
    console.error("❌ Airtable connection failed:", error.message);
    if (error.statusCode) {
      console.error("Status Code:", error.statusCode);
    }
  }
}

testAirtableConnection();
