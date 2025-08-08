// Debug script to find exact field names and options
// Run this in browser console to see all form fields and their options

(function() {
  console.log("🔍 DEBUG: Analyzing form fields and options...");
  
  const inputs = document.querySelectorAll('input, select, textarea');
  console.log(`📝 Found ${inputs.length} form elements`);
  
  // Find specific fields
  const nameField = document.querySelector('input[name="data[dataGrid1][0][name]"]');
  const genderField = document.querySelector('select[name="data[dataGrid1][0][gender]"]');
  const touristTypeField = document.querySelector('select[name="data[dataGrid1][0][touristType]"]');
  const idTypeField = document.querySelector('select[name="data[dataGrid1][0][idType]"]');
  const idValueField = document.querySelector('input[name="data[dataGrid1][0][idValue]"]');
  const ageField = document.querySelector('input[name="data[dataGrid1][0][age]"]');
  
  console.log("\n🎯 Specific Fields Found:");
  console.log("Name field:", nameField ? "✅ Found" : "❌ Not found");
  console.log("Gender field:", genderField ? "✅ Found" : "❌ Not found");
  console.log("Tourist Type field:", touristTypeField ? "✅ Found" : "❌ Not found");
  console.log("ID Type field:", idTypeField ? "✅ Found" : "❌ Not found");
  console.log("ID Value field:", idValueField ? "✅ Found" : "❌ Not found");
  console.log("Age field:", ageField ? "✅ Found" : "❌ Not found");
  
  // Show dropdown options
  if (genderField) {
    console.log("\n🔽 Gender Options:");
    Array.from(genderField.options).forEach((option, index) => {
      console.log(`  ${index + 1}. Value: "${option.value}" | Text: "${option.text}"`);
    });
  }
  
  if (touristTypeField) {
    console.log("\n🔽 Tourist Type Options:");
    Array.from(touristTypeField.options).forEach((option, index) => {
      console.log(`  ${index + 1}. Value: "${option.value}" | Text: "${option.text}"`);
    });
  }
  
  if (idTypeField) {
    console.log("\n🔽 ID Type Options:");
    Array.from(idTypeField.options).forEach((option, index) => {
      console.log(`  ${index + 1}. Value: "${option.value}" | Text: "${option.text}"`);
    });
  }
  
  // Test filling with sample data
  console.log("\n🧪 Testing field filling...");
  
  const testData = {
    Name: "Test User",
    Gender: "Male",
    Age: "25",
    TouristType: "Domestic",
    IDType: "Aadhar",
    IDValue: "1234-5678-9012"
  };
  
  // Fill name
  if (nameField && testData.Name) {
    const uppercaseName = String(testData.Name).toUpperCase().trim();
    nameField.value = uppercaseName;
    nameField.dispatchEvent(new Event('input', { bubbles: true }));
    nameField.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("✅ Filled name:", uppercaseName, "(converted from:", testData.Name + ")");
  }
  
  // Fill age
  if (ageField && testData.Age) {
    ageField.value = testData.Age;
    ageField.dispatchEvent(new Event('input', { bubbles: true }));
    ageField.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("✅ Filled age:", testData.Age);
  }
  
  // Fill gender
  if (genderField && testData.Gender) {
    const genderValue = testData.Gender.toLowerCase();
    for (let option of genderField.options) {
      if (option.value.toLowerCase().includes(genderValue) || 
          option.text.toLowerCase().includes(genderValue)) {
        genderField.value = option.value;
        genderField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("✅ Selected gender:", option.text);
        break;
      }
    }
  }
  
  // Fill tourist type
  if (touristTypeField && testData.TouristType) {
    const touristValue = testData.TouristType.toLowerCase();
    for (let option of touristTypeField.options) {
      if (option.value.toLowerCase().includes(touristValue) || 
          option.text.toLowerCase().includes(touristValue)) {
        touristTypeField.value = option.value;
        touristTypeField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("✅ Selected tourist type:", option.text);
        break;
      }
    }
  }
  
  // Fill ID type
  if (idTypeField && testData.IDType) {
    const idTypeValue = testData.IDType.toLowerCase();
    for (let option of idTypeField.options) {
      if (option.value.toLowerCase().includes(idTypeValue) || 
          option.text.toLowerCase().includes(idTypeValue)) {
        idTypeField.value = option.value;
        idTypeField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("✅ Selected ID type:", option.text);
        break;
      }
    }
  }
  
  // Fill ID value
  if (idValueField && testData.IDValue) {
    idValueField.value = testData.IDValue;
    idValueField.dispatchEvent(new Event('input', { bubbles: true }));
    idValueField.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("✅ Filled ID value:", testData.IDValue);
  }
  
  console.log("\n✅ Debug test completed!");
  
  // Create info panel
  const infoPanel = document.createElement('div');
  infoPanel.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-width: 300px;
    ">
      <h4>🔍 Field Debug Results</h4>
      <p>Name: ${nameField ? '✅' : '❌'}</p>
      <p>Gender: ${genderField ? '✅' : '❌'}</p>
      <p>Tourist Type: ${touristTypeField ? '✅' : '❌'}</p>
      <p>ID Type: ${idTypeField ? '✅' : '❌'}</p>
      <p>ID Value: ${idValueField ? '✅' : '❌'}</p>
      <p>Age: ${ageField ? '✅' : '❌'}</p>
      <button onclick="this.parentElement.remove()" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(infoPanel);
  
})(); 