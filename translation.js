let path = require("path");
let fs = require("fs");
const locales = ["ko", "ja", "en"];
const { GoogleSpreadsheet } = require("google-spreadsheet");

const getTranslationJson = async (lang) => {
  // eslint-disable-next-line no-unused-vars
  fs.unlink(
    path.resolve(__dirname + "/public/locales/" + lang + "/common.json"),
    (err) => {
      console.log(
        "]-----] translation.js::getTranslationJson.err [-----[",
        err
      );
      console.log("삭제");
    }
  );

  try {
    const doc = new GoogleSpreadsheet("[YOUR SHEET ID]", {
      apiKey: "[YOUR API KEY]",
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells();
    const rows = await sheet.getRows();
    const langs = await sheet._headerValues;
    const jsonData = {};

    // i and j starting from 1:
    // JavaScript arrays use 0-based indexing, but in spreadsheets, both rows and columns start from 1.
    // Starting i and j from 1 allows reading data from the spreadsheet starting from cell (1, 1).

    // rows.length + 1:
    // Spreadsheet row numbers start from 1, so rows.length represents the total rows.
    // Adjusting with rows.length + 1 ensures reading data from the 1st row.
    // For example, if there are 3 rows, rows.length is 3, but reading starts from row 1 to 3, so we use rows.length + 1.

    // In summary, starting i and j from 1 aligns with spreadsheet indexing, and rows.length + 1 is for 1-based indexing.

    for (let i = 1; i < rows.length + 1; i++) {
      const key = sheet.getCell(i, 0).value;
      for (let j = 1; j < langs.length; j++) {
        const lang = langs[j];

        jsonData[lang] = jsonData[lang] || {}; // Initialize language object if not exists
        jsonData[lang][key] = sheet.getCell(i, j).value;
      }
    }

    // Loop through languages and write JSON files
    Object.keys(jsonData).forEach((lang) => {
      console.log(lang);
      const jsonString = JSON.stringify(jsonData[lang], null, 2);
      const filePath = `public/locales/${lang}/common.json`;
      fs.writeFileSync(filePath, jsonString);
      console.log(`JSON file created for ${lang}: ${filePath}`);
    });
  } catch (err) {
    console.log(err);
  }
};

async function processArray() {
  // map array to promises
  const promises = locales.map((item) => getTranslationJson(item));
  // wait until all promises are resolved
  // eslint-disable-next-line no-undef
  await Promise.all(promises);
  console.log("Done!");
}
processArray();
