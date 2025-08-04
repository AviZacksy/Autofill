// Sample data generator for Excel file
// This will help you create the correct Excel format

const sampleData = [
  {
    Name: "Aman Singh",
    Gender: "Male",
    Age: "25",
    TouristType: "Domestic",
    IDType: "Aadhar",
    IDValue: "1234-5678-9012"
  },
  {
    Name: "Priya Sharma",
    Gender: "Female", 
    Age: "28",
    TouristType: "International",
    IDType: "Passport",
    IDValue: "A12345678"
  },
  {
    Name: "Rahul Kumar",
    Gender: "Male",
    Age: "32",
    TouristType: "Domestic",
    IDType: "PAN",
    IDValue: "ABCDE1234F"
  }
];

console.log("📋 Sample data for Excel file:");
console.log(JSON.stringify(sampleData, null, 2));

console.log("\n📝 Instructions:");
console.log("1. Create a new Excel file");
console.log("2. Add these columns in the first row:");
console.log("   - Name");
console.log("   - Gender");
console.log("   - Age");
console.log("   - TouristType");
console.log("   - IDType");
console.log("   - IDValue");
console.log("3. Add the data from above");
console.log("4. Save as .xlsx file");
console.log("5. Upload to extension");

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("✅ Data copied to clipboard!");
  });
}

// Create CSV format
const csvData = [
  "Name,Gender,Age,TouristType,IDType,IDValue",
  "Aman Singh,Male,25,Domestic,Aadhar,1234-5678-9012",
  "Priya Sharma,Female,28,International,Passport,A12345678",
  "Rahul Kumar,Male,32,Domestic,PAN,ABCDE1234F"
].join('\n');

console.log("\n📄 CSV Format (copy this to Excel):");
console.log(csvData);

// Add copy button
const copyButton = document.createElement('button');
copyButton.textContent = '📋 Copy CSV Data';
copyButton.style.cssText = 'position: fixed; top: 10px; left: 10px; background: #10b981; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; z-index: 99999;';
copyButton.onclick = () => copyToClipboard(csvData);
document.body.appendChild(copyButton);

console.log("\n✅ Sample data ready! Use the copy button to get CSV data."); 