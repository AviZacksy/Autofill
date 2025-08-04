// Test script to identify form fields
// Run this in the browser console on the form page

(function() {
  console.log("🧪 TEST: Form field identification script");
  
  // Function to highlight elements
  function highlightElement(element, color = 'red') {
    element.style.border = `3px solid ${color}`;
    element.style.backgroundColor = `${color}20`;
    element.style.padding = '5px';
    element.style.margin = '2px';
  }
  
  // Function to remove highlighting
  function removeHighlight(element) {
    element.style.border = '';
    element.style.backgroundColor = '';
    element.style.padding = '';
    element.style.margin = '';
  }
  
  // Find all form elements
  const allInputs = document.querySelectorAll('input, select, textarea');
  console.log(`📝 Found ${allInputs.length} form elements`);
  
  // Categorize elements
  const nameFields = [];
  const ageFields = [];
  const genderFields = [];
  const otherFields = [];
  
  allInputs.forEach((input, index) => {
    const type = input.type || input.tagName.toLowerCase();
    const name = input.name || '';
    const id = input.id || '';
    const placeholder = input.placeholder || '';
    const value = input.value || '';
    
    console.log(`${index + 1}. ${type} - name:"${name}" id:"${id}" placeholder:"${placeholder}" value:"${value}"`);
    
    // Categorize based on attributes
    const searchText = `${name} ${id} ${placeholder}`.toLowerCase();
    
    if (searchText.includes('name')) {
      nameFields.push(input);
      highlightElement(input, 'green');
    } else if (searchText.includes('age')) {
      ageFields.push(input);
      highlightElement(input, 'blue');
    } else if (searchText.includes('gender') || searchText.includes('sex')) {
      genderFields.push(input);
      highlightElement(input, 'purple');
    } else {
      otherFields.push(input);
      highlightElement(input, 'orange');
    }
  });
  
  console.log(`✅ Name fields: ${nameFields.length}`);
  console.log(`✅ Age fields: ${ageFields.length}`);
  console.log(`✅ Gender fields: ${genderFields.length}`);
  console.log(`✅ Other fields: ${otherFields.length}`);
  
  // Create test panel
  const testPanel = document.createElement('div');
  testPanel.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 14px;
      z-index: 99999;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    ">
      <h3>🧪 Form Test Panel</h3>
      <p><strong>Total Fields:</strong> ${allInputs.length}</p>
      <p><span style="color: green;">🟢 Name Fields:</span> ${nameFields.length}</p>
      <p><span style="color: blue;">🔵 Age Fields:</span> ${ageFields.length}</p>
      <p><span style="color: purple;">🟣 Gender Fields:</span> ${genderFields.length}</p>
      <p><span style="color: orange;">🟠 Other Fields:</span> ${otherFields.length}</p>
      
      <div style="margin-top: 15px;">
        <button onclick="testFill()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Test Fill</button>
        <button onclick="clearHighlights()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Clear</button>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(testPanel);
  
  // Test fill function
  window.testFill = function() {
    console.log("🧪 Testing form fill...");
    
    // Test name field
    if (nameFields.length > 0) {
      nameFields[0].value = "Test User";
      nameFields[0].dispatchEvent(new Event('input', { bubbles: true }));
      nameFields[0].dispatchEvent(new Event('change', { bubbles: true }));
      console.log("✅ Filled name: Test User");
    }
    
    // Test age field
    if (ageFields.length > 0) {
      ageFields[0].value = "25";
      ageFields[0].dispatchEvent(new Event('input', { bubbles: true }));
      ageFields[0].dispatchEvent(new Event('change', { bubbles: true }));
      console.log("✅ Filled age: 25");
    }
    
    // Test gender field
    if (genderFields.length > 0) {
      const genderField = genderFields[0];
      if (genderField.tagName === 'SELECT') {
        // Try to select first option
        if (genderField.options.length > 0) {
          genderField.value = genderField.options[0].value;
          genderField.dispatchEvent(new Event('change', { bubbles: true }));
          console.log("✅ Selected gender:", genderField.options[0].text);
        }
      } else {
        genderField.value = "Male";
        genderField.dispatchEvent(new Event('input', { bubbles: true }));
        genderField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("✅ Filled gender: Male");
      }
    }
    
    console.log("🧪 Test fill completed!");
  };
  
  // Clear highlights function
  window.clearHighlights = function() {
    allInputs.forEach(input => removeHighlight(input));
    console.log("🧹 Cleared all highlights");
  };
  
  console.log("✅ Test panel created! Use the buttons to test form filling.");
})(); 