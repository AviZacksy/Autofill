// Simple test script - Copy and paste this in browser console
// This will help us understand what's happening with the form

(function() {
  console.log("🧪 SIMPLE TEST: Checking for form fields...");
  
  // Check current page
  console.log("📍 Current URL:", window.location.href);
  console.log("📍 Current domain:", window.location.hostname);
  
  // Find all form elements
  const allInputs = document.querySelectorAll('input, select, textarea');
  console.log("📝 Total form elements found:", allInputs.length);
  
  if (allInputs.length === 0) {
    console.log("❌ No form elements found on this page");
    
    // Check if we're in an iframe
    if (window !== window.top) {
      console.log("🎯 We're inside an iframe");
    } else {
      console.log("🌐 We're on the main page");
      
      // Check for iframes
      const iframes = document.querySelectorAll('iframe');
      console.log("🖼️ Iframes found:", iframes.length);
      
      iframes.forEach((iframe, index) => {
        console.log(`  ${index + 1}. ${iframe.src}`);
      });
    }
    
    // Set up a watcher for dynamic content
    console.log("👀 Setting up watcher for dynamic content...");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const newInputs = document.querySelectorAll('input, select, textarea');
          if (newInputs.length > allInputs.length) {
            console.log("🎉 New form elements detected!");
            console.log("📝 New total:", newInputs.length);
            
            newInputs.forEach((input, index) => {
              const type = input.type || input.tagName.toLowerCase();
              const name = input.name || '';
              const id = input.id || '';
              const placeholder = input.placeholder || '';
              console.log(`  ${index + 1}. ${type} - name:"${name}" id:"${id}" placeholder:"${placeholder}"`);
            });
            
            observer.disconnect();
          }
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Stop watching after 15 seconds
    setTimeout(() => {
      observer.disconnect();
      console.log("⏰ Watcher stopped after 15 seconds");
    }, 15000);
    
  } else {
    console.log("✅ Form elements found! Here they are:");
    
    allInputs.forEach((input, index) => {
      const type = input.type || input.tagName.toLowerCase();
      const name = input.name || '';
      const id = input.id || '';
      const placeholder = input.placeholder || '';
      const value = input.value || '';
      
      console.log(`${index + 1}. ${type} - name:"${name}" id:"${id}" placeholder:"${placeholder}" value:"${value}"`);
      
      // Highlight the element
      input.style.border = '2px solid red';
      input.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      
      setTimeout(() => {
        input.style.border = '';
        input.style.backgroundColor = '';
      }, 3000);
    });
    
    // Test filling with sample data
    console.log("🧪 Testing form fill with sample data...");
    
    const testData = {
      Name: "Test User",
      Age: "25",
      Gender: "Male"
    };
    
    // Try to fill name
    const nameInputs = document.querySelectorAll('input[name*="name" i], input[placeholder*="name" i], input[id*="name" i], input[type="text"]');
    if (nameInputs.length > 0) {
      const uppercaseName = String(testData.Name).toUpperCase().trim();
      nameInputs[0].value = uppercaseName;
      nameInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      nameInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      console.log("✅ Filled name:", uppercaseName, "(converted from:", testData.Name + ")");
    }
    
    // Try to fill age
    const ageInputs = document.querySelectorAll('input[name*="age" i], input[placeholder*="age" i], input[id*="age" i], input[type="number"]');
    if (ageInputs.length > 0) {
      ageInputs[0].value = testData.Age;
      ageInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      ageInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      console.log("✅ Filled age:", testData.Age);
    }
    
    // Try to fill gender
    const genderSelects = document.querySelectorAll('select[name*="gender" i], select[id*="gender" i], select');
    if (genderSelects.length > 0) {
      const genderSelect = genderSelects[0];
      console.log("🔽 Gender options:", Array.from(genderSelect.options).map(opt => opt.text));
      
      for (let option of genderSelect.options) {
        if (option.text.toLowerCase().includes('male')) {
          genderSelect.value = option.value;
          genderSelect.dispatchEvent(new Event('change', { bubbles: true }));
          console.log("✅ Selected gender:", option.text);
          break;
        }
      }
    }
    
    console.log("✅ Test fill completed!");
  }
  
  // Create a floating info panel
  const infoPanel = document.createElement('div');
  infoPanel.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-width: 300px;
    ">
      <h4>🧪 Simple Test Results</h4>
      <p>URL: ${window.location.href}</p>
      <p>Form Elements: ${allInputs.length}</p>
      <p>In Iframe: ${window !== window.top ? 'Yes' : 'No'}</p>
      <button onclick="this.parentElement.remove()" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(infoPanel);
  
  console.log("✅ Test completed! Check the floating panel for summary.");
})(); 