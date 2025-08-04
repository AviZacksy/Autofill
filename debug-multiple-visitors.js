// Debug script to detect multiple visitors in the form
// Run this in browser console to see all visitor fields

(function() {
  console.log("🔍 DEBUG: Analyzing multiple visitors in form...");
  
  // Check for different visitor indices
  const visitorIndices = [0, 1, 2, 3, 4, 5]; // Check up to 6 visitors
  const fieldTypes = ['name', 'age', 'gender', 'touristType', 'idType', 'idValue'];
  
  console.log("📊 Checking for multiple visitors...");
  
  visitorIndices.forEach(visitorIndex => {
    console.log(`\n👤 Visitor ${visitorIndex + 1}:`);
    
    const visitorFields = {};
    let hasFields = false;
    
    fieldTypes.forEach(fieldType => {
      // Try different selector patterns
      const selectors = [
        `input[name="data[dataGrid1][${visitorIndex}][${fieldType}]"]`,
        `select[name="data[dataGrid1][${visitorIndex}][${fieldType}]"]`,
        `input[name*="[${visitorIndex}][${fieldType}]"]`,
        `select[name*="[${visitorIndex}][${fieldType}]"]`
      ];
      
      let foundField = null;
      for (let selector of selectors) {
        foundField = document.querySelector(selector);
        if (foundField) break;
      }
      
      if (foundField) {
        hasFields = true;
        visitorFields[fieldType] = {
          element: foundField,
          tagName: foundField.tagName,
          type: foundField.type || 'select',
          value: foundField.value,
          placeholder: foundField.placeholder || ''
        };
        
        // For dropdowns, show options
        if (foundField.tagName === 'SELECT') {
          visitorFields[fieldType].options = Array.from(foundField.options).map(opt => ({
            value: opt.value,
            text: opt.text
          }));
        }
        
        console.log(`  ✅ ${fieldType}: ${foundField.tagName} (${foundField.type || 'select'})`);
      } else {
        console.log(`  ❌ ${fieldType}: Not found`);
      }
    });
    
    if (hasFields) {
      console.log(`  📝 Visitor ${visitorIndex + 1} has form fields`);
      
      // Highlight the fields
      Object.values(visitorFields).forEach(field => {
        field.element.style.border = '3px solid green';
        field.element.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
      });
    } else {
      console.log(`  ❌ Visitor ${visitorIndex + 1} has no fields`);
    }
  });
  
  // Also check for "Add Visitor" or similar buttons
  const addButtons = document.querySelectorAll('button, a, input[type="button"]');
  const addVisitorButtons = Array.from(addButtons).filter(btn => {
    const text = btn.textContent || btn.value || '';
    return text.toLowerCase().includes('add') || 
           text.toLowerCase().includes('visitor') || 
           text.toLowerCase().includes('guest') ||
           text.toLowerCase().includes('person');
  });
  
  if (addVisitorButtons.length > 0) {
    console.log("\n➕ Add Visitor Buttons Found:");
    addVisitorButtons.forEach((btn, index) => {
      console.log(`  ${index + 1}. "${btn.textContent || btn.value}" - ${btn.tagName}`);
      btn.style.border = '3px solid blue';
      btn.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
    });
  }
  
  // Check for visitor count or total fields
  const visitorCountElements = document.querySelectorAll('*');
  const countElements = Array.from(visitorCountElements).filter(el => {
    const text = el.textContent || '';
    return text.includes('visitor') || text.includes('guest') || text.includes('person');
  });
  
  if (countElements.length > 0) {
    console.log("\n📊 Visitor Count Elements:");
    countElements.forEach((el, index) => {
      console.log(`  ${index + 1}. "${el.textContent.trim()}" - ${el.tagName}`);
    });
  }
  
  console.log("\n🎯 SUMMARY:");
  console.log("Run this script after adding visitors to see all available fields");
  console.log("Use the extension to fill each visitor one by one");
  
})(); 