function waitForAllSelectors(selectors, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    
    // First check if elements already exist
    const allPresent = selectors.every(sel => document.querySelector(sel));
    if (allPresent) {
      console.log("✅ All fields already present!");
      resolve(true);
      return;
    }
    
    console.log("⏳ Waiting for fields:", selectors);
    
    const observer = new MutationObserver(() => {
      const allPresent = selectors.every(sel => {
        const el = document.querySelector(sel);
        if (el) {
          console.log(`✅ Found: ${sel}`);
        }
        return el;
      });
      
      if (allPresent) {
        observer.disconnect();
        console.log("✅ All fields found!");
        resolve(true);
      } else if (Date.now() - start > timeout) {
        observer.disconnect();
        const missing = selectors.filter(sel => !document.querySelector(sel));
        console.error("❌ Timeout: Missing fields:", missing);
        reject("Timeout: Some fields not found. Missing: " + missing.join(", "));
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'class']
    });
  });
}

// Function to clean ID values (remove dashes, spaces, etc.)
function cleanIDValue(value) {
  if (!value) return value;
  // Remove only dashes, spaces, and other separators, keep letters and numbers
  return String(value).replace(/[-_\s]/g, '');
}

async function humanType(selector, text) {
  try {
    const el = document.querySelector(selector);
    if (!el) {
      console.warn("❌ Element not found:", selector);
      return;
    }
    
    // Clean ID values if it's an ID field (not name fields)
    let cleanedText = text;
    if ((selector.includes('idValue') || selector.includes('IDValue') || selector.includes('id') || selector.includes('ID')) && 
        !selector.includes('name') && !selector.includes('Name')) {
      cleanedText = cleanIDValue(text);
      console.log(`🧹 Cleaned ID value: '${text}' → '${cleanedText}'`);
    }
    
    console.log(`📝 Human typing '${cleanedText}' into ${selector}`);
    
    // Focus the element first
    el.focus();
    el.click();
    
    // Ultra fast start - minimal delay before typing (20-50ms)
    await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
    
    // Clear existing value
    el.value = "";
    
    // Type character by character with human-like delays
    const textToType = String(cleanedText).trim();
    for (let i = 0; i < textToType.length; i++) {
      const char = textToType[i];
      
      // Add character
      el.value += char;
      
      // Dispatch input event for each character
      try {
        el.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (e) {
        // Ignore security script errors
      }
      
                        // Ultra fast typing - minimal delay between characters (5-15ms)
                  await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
                  
                  // Rarely add a tiny pause (minimal thinking time)
                  if (Math.random() < 0.02) {
                    await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
                  }
    }
    
    // Ultra fast completion - minimal delay after typing (10-20ms)
    await new Promise(r => setTimeout(r, 10 + Math.random() * 10));
    
    // Dispatch final events
    try {
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    } catch (e) {
      // Ignore security script errors
    }
    
    // Verify the value was set correctly
    const expectedValue = String(cleanedText).trim();
    const actualValue = el.value;
    
    if (selector.includes('name') || selector.includes('Name')) {
      // For name fields, check case-insensitive
      if (actualValue.toLowerCase() !== expectedValue.toLowerCase()) {
        console.log(`⚠️ Name field case mismatch: expected "${expectedValue}", got "${actualValue}"`);
      } else {
        console.log(`✅ Human typed: ${selector} = "${actualValue}"`);
      }
    } else {
      // For other fields, check exact match
      if (actualValue !== expectedValue) {
        console.log(`⚠️ Field value mismatch: expected "${expectedValue}", got "${actualValue}"`);
      } else {
        console.log(`✅ Human typed: ${selector} = "${actualValue}"`);
      }
    }
  } catch (err) {
    console.warn(`❌ Typing failed for ${selector}`, err);
  }
}

async function humanSelectDropdown(selector, value) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn("❌ Dropdown not found:", selector);
    return;
  }
  
  console.log(`🔽 Human selecting '${value}' in ${selector}`);
  
  try {
    // Focus and click to open dropdown (human-like)
    el.focus();
    el.click();
    
    // Ultra fast dropdown - minimal delay (10-20ms)
    await new Promise(r => setTimeout(r, 10 + Math.random() * 10));
    
    const val = String(value).trim().toLowerCase();
    
    // Try exact match first
    for (let opt of el.options) {
      if (opt.value.toLowerCase() === val || opt.text.toLowerCase() === val) {
        // Simulate human selection with delays
        el.focus();
        
        // Ultra fast selection - minimal delay (5-15ms)
        await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
        
        el.value = opt.value;
        
        try {
          el.dispatchEvent(new Event("change", { bubbles: true }));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        } catch (e) {
          console.log("🔒 Security script detected on dropdown change");
        }
        
        // Ultra fast after selection - minimal delay (5-15ms)
        await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
        
        console.log(`✅ Human selected: ${opt.text} in ${selector}`);
        return;
      }
    }
    
    // Try partial match
    for (let opt of el.options) {
      if (opt.value.toLowerCase().includes(val) || opt.text.toLowerCase().includes(val)) {
        // Simulate human selection with delays
        el.focus();
        
        // Ultra fast selection - minimal delay (5-15ms)
        await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
        
        el.value = opt.value;
        
        try {
          el.dispatchEvent(new Event("change", { bubbles: true }));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        } catch (e) {
          console.log("🔒 Security script detected on dropdown change");
        }
        
        // Ultra fast after selection - minimal delay (5-15ms)
        await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
        
        console.log(`✅ Human selected (partial): ${opt.text} in ${selector}`);
        return;
      }
    }
    
    console.warn(`❌ Value '${value}' not found in ${selector}. Available options:`, 
      Array.from(el.options).map(opt => `${opt.value} (${opt.text})`));
  } catch (err) {
    console.warn(`❌ Dropdown selection failed for ${selector}`, err);
  }
}

// Function to simulate human-like mouse movement and clicking
async function humanClick(element) {
  try {
    // Get element position
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Simulate mouse events
    element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
    
    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
    
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
    
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    console.log(`🖱️ Human-like click on ${element.tagName}`);
  } catch (err) {
    console.warn(`❌ Human click failed:`, err);
  }
}

// Function to inject script into iframe
function injectIntoIframe(iframe, data) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    console.log("🎯 Injecting into iframe:", iframe.src);
    
    // Create and inject the auto-fill script
    const script = iframeDoc.createElement('script');
    script.textContent = `
      (function() {
        console.log("🎯 Auto-fill script injected into iframe");
        
        // Function to clean ID values (remove dashes, spaces, etc.)
        function cleanIDValue(value) {
          if (!value) return value;
          // Remove only dashes, spaces, and other separators, keep letters and numbers
          return String(value).replace(/[-_\s]/g, '');
        }
        
        const data = ${JSON.stringify(data)};
        const record = data[0];
        
        if (!record) {
          console.error("❌ No data received in iframe");
          return;
        }
        
        console.log("🚀 Starting auto-fill in iframe with data:", record);
        
        // Wait for form to load with retry mechanism
        let retryCount = 0;
        const maxRetries = 10; // Reduced from 20 to 10 (5 seconds total)
        
        function waitForForm() {
          const inputs = document.querySelectorAll('input, select, textarea');
          console.log("🔍 Found", inputs.length, "form fields in iframe (attempt", retryCount + 1, ")");
          
          if (inputs.length > 0) {
            console.log("✅ Form fields found! Starting to fill...");
            
            // Try to fill common fields
            const nameInputs = document.querySelectorAll('input[name*="name" i], input[placeholder*="name" i], input[id*="name" i], input[type="text"]');
            const ageInputs = document.querySelectorAll('input[name*="age" i], input[placeholder*="age" i], input[id*="age" i], input[type="number"]');
            const genderSelects = document.querySelectorAll('select[name*="gender" i], select[id*="gender" i], select');
            
            console.log("📝 Name inputs found:", nameInputs.length);
            console.log("📝 Age inputs found:", ageInputs.length);
            console.log("📝 Gender selects found:", genderSelects.length);
            
            // Fill name - try first text input if no specific name field
            if (nameInputs.length > 0 && record.Name) {
              nameInputs[0].value = record.Name;
              nameInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
              nameInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
              console.log("✅ Filled name:", record.Name);
            }
            
            // Fill age
            if (ageInputs.length > 0 && record.Age) {
              ageInputs[0].value = record.Age;
              ageInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
              ageInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
              console.log("✅ Filled age:", record.Age);
            }
            
            // Fill gender
            if (genderSelects.length > 0 && record.Gender) {
              const genderSelect = genderSelects[0];
              const genderValue = record.Gender.toLowerCase();
              
              for (let option of genderSelect.options) {
                if (option.value.toLowerCase().includes(genderValue) || 
                    option.text.toLowerCase().includes(genderValue)) {
                  genderSelect.value = option.value;
                  genderSelect.dispatchEvent(new Event('change', { bubbles: true }));
                  console.log("✅ Selected gender:", option.text);
                  break;
                }
              }
            }
            
            // Fill Tourist Type - using specific selectors
            const touristTypeSelects = document.querySelectorAll('select[name*="touristType" i], select[id*="touristType" i], select[name="data[dataGrid1][0][touristType]"]');
            if (touristTypeSelects.length > 0 && record.TouristType) {
              const touristSelect = touristTypeSelects[0];
              const touristValue = record.TouristType.toLowerCase();
              
              console.log("🔽 Tourist Type options:", Array.from(touristSelect.options).map(opt => opt.text));
              console.log("🔍 Looking for:", touristValue);
              
              for (let option of touristSelect.options) {
                if (option.value.toLowerCase().includes(touristValue) || 
                    option.text.toLowerCase().includes(touristValue)) {
                  touristSelect.value = option.value;
                  touristSelect.dispatchEvent(new Event('change', { bubbles: true }));
                  console.log("✅ Selected tourist type:", option.text);
                  break;
                }
              }
            } else {
              console.log("❌ Tourist Type select not found");
              // Try alternative approach - find by index
              const allSelects = document.querySelectorAll('select');
              if (allSelects.length >= 3) { // Assuming tourist type is the 3rd select
                const touristSelect = allSelects[2]; // Index 2 for 3rd select
                const touristValue = record.TouristType.toLowerCase();
                
                console.log("🔽 Tourist Type options (by index):", Array.from(touristSelect.options).map(opt => opt.text));
                
                for (let option of touristSelect.options) {
                  if (option.value.toLowerCase().includes(touristValue) || 
                      option.text.toLowerCase().includes(touristValue)) {
                    touristSelect.value = option.value;
                    touristSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log("✅ Selected tourist type (by index):", option.text);
                    break;
                  }
                }
              }
            }
            
            // Fill ID Type
            const idTypeSelects = document.querySelectorAll('select[name*="idType" i], select[id*="idType" i], select[name="data[dataGrid1][0][idType]"]');
            if (idTypeSelects.length > 0 && record.IDType) {
              const idTypeSelect = idTypeSelects[0];
              const idTypeValue = record.IDType.toLowerCase();
              
              for (let option of idTypeSelect.options) {
                if (option.value.toLowerCase().includes(idTypeValue) || 
                    option.text.toLowerCase().includes(idTypeValue)) {
                  idTypeSelect.value = option.value;
                  idTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                  console.log("✅ Selected ID type:", option.text);
                  break;
                }
              }
            }
            
            // Fill ID Value
            const idValueInputs = document.querySelectorAll('input[name*="idValue" i], input[id*="idValue" i], input[placeholder*="ID Proof" i], input[name="data[dataGrid1][0][idValue]"]');
            if (idValueInputs.length > 0 && record.IDValue) {
              const cleanedIDValue = cleanIDValue(record.IDValue);
              idValueInputs[0].value = cleanedIDValue;
              idValueInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
              idValueInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
              console.log("✅ Filled ID value:", cleanedIDValue, "(cleaned from:", record.IDValue + ")");
            }
            
            console.log("✅ Visitor ${visitorIndex + 1} filled in iframe!");
            return;
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            // Ultra fast retry - minimal delay from 100ms to 50ms
            setTimeout(waitForForm, 50);
          } else {
            console.error("❌ Form fields not found after", maxRetries, "attempts");
          }
        }
        
        // Start waiting for form
        waitForForm();
      })();
    `;
    
    iframeDoc.head.appendChild(script);
    console.log("✅ Script injected into iframe successfully");
    
  } catch (error) {
    console.error("❌ Failed to inject into iframe:", error);
    // If direct injection fails, try postMessage
    iframe.contentWindow.postMessage({ type: "AUTO_FILL", payload: data }, "*");
  }
}

// Global completion tracking with timestamp
let completedVisitors = new Map(); // visitorIndex -> timestamp

// Listen for messages from popup
window.addEventListener("message", async (event) => {
  if (event.data.type !== "AUTO_FILL") return;
  
  // Cleanup any scroll prevention first
  cleanupScrollPrevention();
  
  const data = event.data.payload;
  const visitorIndex = event.data.visitorIndex || 0; // Default to visitor 0 if not specified
  
  if (!data || !data[0]) {
    console.error("❌ No data received");
    return;
  }

  // Check if this visitor is already completed (within last 5 minutes)
  const now = Date.now();
  const lastCompletion = completedVisitors.get(visitorIndex);
  if (lastCompletion && (now - lastCompletion) < 300000) { // 5 minutes
    console.log("✅ Visitor", visitorIndex + 1, "already completed recently, skipping...");
    return;
  }

  console.log("🚀 Starting auto-fill for visitor", visitorIndex + 1);
  
  // Add completion flag to prevent re-filling
  let isCompleted = false;
  
  // First, check if we're in an iframe
  if (window !== window.top) {
    console.log("🎯 Filling form in iframe");
    // We're inside an iframe, fill the form directly
    try {
      const inputs = document.querySelectorAll('input, select, textarea');
      
      if (inputs.length > 0 && !isCompleted) {
        // Fill common fields for specific visitor
        const nameInputs = document.querySelectorAll(`input[name="data[dataGrid1][${visitorIndex}][name]"], input[name*="[${visitorIndex}][name]"], input[name*="name" i], input[placeholder*="name" i], input[id*="name" i]`);
        const ageInputs = document.querySelectorAll(`input[name="data[dataGrid1][${visitorIndex}][age]"], input[name*="[${visitorIndex}][age]"], input[name*="age" i], input[placeholder*="age" i], input[id*="age" i]`);
        const genderSelects = document.querySelectorAll(`select[name="data[dataGrid1][${visitorIndex}][gender]"], select[name*="[${visitorIndex}][gender]"], select[name*="gender" i], select[id*="gender" i]`);
        
        console.log("📝 Name inputs found:", nameInputs.length);
        console.log("📝 Age inputs found:", ageInputs.length);
        console.log("📝 Gender selects found:", genderSelects.length);
        
        // Fill name for specific visitor
        if (nameInputs.length > 0 && data[0].Name) {
          nameInputs[0].value = data[0].Name;
          nameInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
          nameInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
          console.log("✅ Filled name for visitor", visitorIndex + 1, ":", data[0].Name);
        }
        
        // Fill age for specific visitor
        if (ageInputs.length > 0 && data[0].Age) {
          ageInputs[0].value = data[0].Age;
          ageInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
          ageInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
          console.log("✅ Filled age for visitor", visitorIndex + 1, ":", data[0].Age);
        }
        
        // Fill gender for specific visitor
        if (genderSelects.length > 0 && data[0].Gender) {
          const genderSelect = genderSelects[0];
          const genderValue = data[0].Gender.toLowerCase();
          
          for (let option of genderSelect.options) {
            if (option.value.toLowerCase().includes(genderValue) || 
                option.text.toLowerCase().includes(genderValue)) {
              genderSelect.value = option.value;
              genderSelect.dispatchEvent(new Event('change', { bubbles: true }));
              console.log("✅ Selected gender for visitor", visitorIndex + 1, ":", option.text);
              break;
            }
          }
        }
        
        // Fill Tourist Type for specific visitor
        const touristTypeSelects = document.querySelectorAll(`select[name="data[dataGrid1][${visitorIndex}][touristType]"], select[name*="[${visitorIndex}][touristType]"], select[name*="touristType" i], select[id*="touristType" i]`);
        if (touristTypeSelects.length > 0 && data[0].TouristType) {
          const touristSelect = touristTypeSelects[0];
          const touristValue = data[0].TouristType.toLowerCase();
          
          for (let option of touristSelect.options) {
            if (option.value.toLowerCase().includes(touristValue) || 
                option.text.toLowerCase().includes(touristValue)) {
              touristSelect.value = option.value;
              touristSelect.dispatchEvent(new Event('change', { bubbles: true }));
              console.log("✅ Selected tourist type for visitor", visitorIndex + 1, ":", option.text);
              break;
            }
          }
        }
        
        // Fill ID Type for specific visitor
        const idTypeSelects = document.querySelectorAll(`select[name="data[dataGrid1][${visitorIndex}][idType]"], select[name*="[${visitorIndex}][idType]"], select[name*="idType" i], select[id*="idType" i]`);
        if (idTypeSelects.length > 0 && data[0].IDType) {
          const idTypeSelect = idTypeSelects[0];
          const idTypeValue = data[0].IDType.toLowerCase();
          
          for (let option of idTypeSelect.options) {
            if (option.value.toLowerCase().includes(idTypeValue) || 
                option.text.toLowerCase().includes(idTypeValue)) {
              idTypeSelect.value = option.value;
              idTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
              console.log("✅ Selected ID type for visitor", visitorIndex + 1, ":", option.text);
              break;
            }
          }
        }
        
        // Fill ID Value for specific visitor
        const idValueInputs = document.querySelectorAll(`input[name="data[dataGrid1][${visitorIndex}][idValue]"], input[name*="[${visitorIndex}][idValue]"], input[name*="idValue" i], input[id*="idValue" i], input[placeholder*="ID Proof" i]`);
        if (idValueInputs.length > 0 && data[0].IDValue) {
          idValueInputs[0].value = data[0].IDValue;
          idValueInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
          idValueInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
          console.log("✅ Filled ID value for visitor", visitorIndex + 1, ":", data[0].IDValue);
        }
        
        // Mark as completed
        isCompleted = true;
        completedVisitors.set(visitorIndex, Date.now());
        
        // Show success message
        const banner = document.createElement('div');
        banner.innerHTML = `✅ Visitor ${visitorIndex + 1} filled in iframe!`;
        banner.style.cssText = 'position: fixed; top: 10px; right: 10px; background: green; color: white; padding: 10px; border-radius: 5px; z-index: 99999;';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 3000);
        
        console.log("✅ Auto-fill completed in iframe for visitor", visitorIndex + 1);
        return; // Stop here - don't continue
      } else if (isCompleted) {
        console.log("✅ Form already completed for visitor", visitorIndex + 1);
        return; // Stop if already completed
      }
    } catch (error) {
      console.error("❌ Error filling form in iframe:", error);
      return; // Stop on error
    }
    return; // Stop if no inputs found
  }
  
  // We're on the main page, look for iframes
  console.log("🔍 Looking for iframes on main page...");
  const iframes = document.querySelectorAll('iframe');
  console.log("🖼️ Found", iframes.length, "iframes");
  
  if (iframes.length > 0) {
    // Try to inject into each iframe
    iframes.forEach((iframe, index) => {
      console.log(`🎯 Trying iframe ${index + 1}:`, iframe.src);
      
      // Check if this is the target iframe (RTR booking form)
      if (iframe.src && (iframe.src.includes('forestrajasthan.com') || iframe.src.includes('zipr.in/RTR'))) {
        console.log("✅ Found target iframe:", iframe.src);
        
        // Wait for iframe to load
        if (iframe.contentDocument) {
          injectIntoIframe(iframe, data);
        } else {
          iframe.addEventListener('load', () => {
            console.log("🎯 Iframe loaded, injecting script...");
            setTimeout(() => injectIntoIframe(iframe, data), 1000);
          });
          
          // Also try immediately in case iframe is already loaded
          setTimeout(() => {
            if (iframe.contentDocument) {
              injectIntoIframe(iframe, data);
            }
          }, 500);
        }
      }
    });
  } else {
    // No iframes found, try filling on main page
    console.log("🔍 No iframes found, trying main page...");
    try {
      // Simple approach - no aggressive scroll prevention
      console.log("🚀 Starting form filling without scroll interference");
      
      // Try multiple selector patterns
      const selectors = [
        // Original selectors
      '#e0gwe8-name',
      '#empokbu-gender',
      '#e97ct9l-touristType',
      '#e1vd6ue-idType',
      '#eroekh-idValue',
        '#ewlk6gc-age',
        
        // Common alternative patterns
        'input[name="name"]',
        'input[name="Name"]',
        'select[name="gender"]',
        'select[name="Gender"]',
        'select[name="touristType"]',
        'select[name="TouristType"]',
        'select[name="idType"]',
        'select[name="IDType"]',
        'input[name="idValue"]',
        'input[name="IDValue"]',
        'input[name="age"]',
        'input[name="Age"]',
        
        // Generic patterns
        'input[placeholder*="name" i]',
        'input[placeholder*="Name" i]',
        'select[placeholder*="gender" i]',
        'select[placeholder*="Gender" i]',
        'input[placeholder*="age" i]',
        'input[placeholder*="Age" i]'
      ];

      console.log("🔍 Looking for form fields...");
      
      // Check which selectors exist
      const existingSelectors = selectors.filter(sel => document.querySelector(sel));
      console.log("✅ Found existing selectors:", existingSelectors);
      
      // If no selectors found, stop here
      if (existingSelectors.length === 0) {
        console.log("❌ No form fields found on main page");
        return; // Stop here
      }
      
      // Check if already completed
      if (isCompleted) {
        console.log("✅ Form already completed for visitor", visitorIndex + 1);
        return; // Stop if already completed
      }

      // Wait for at least some basic fields
      await waitForAllSelectors([
        'input[name="name"], input[name="Name"], #e0gwe8-name, input[placeholder*="name" i]',
        'select[name="gender"], select[name="Gender"], #empokbu-gender',
        'input[name="age"], input[name="Age"], #ewlk6gc-age, input[placeholder*="age" i]'
      ]);

      console.log("✅ Basic fields found. Starting auto-fill...");
      
      // Fill name field for specific visitor
      const nameSelectors = [
        `input[name="data[dataGrid1][${visitorIndex}][name]"]`,
        `input[name*="[${visitorIndex}][name]"]`,
        '#e0gwe8-name', 
        'input[name="name"]', 
        'input[name="Name"]', 
        'input[placeholder*="name" i]'
      ];
      for (let sel of nameSelectors) {
        if (document.querySelector(sel)) {
          await humanType(sel, data[0].Name || data[0].name);
          break;
        }
      }
      
      // Fill gender dropdown for specific visitor
      const genderSelectors = [
        `select[name="data[dataGrid1][${visitorIndex}][gender]"]`,
        `select[name*="[${visitorIndex}][gender]"]`,
        '#empokbu-gender', 
        'select[name="gender"]', 
        'select[name="Gender"]'
      ];
      for (let sel of genderSelectors) {
        if (document.querySelector(sel)) {
          await humanSelectDropdown(sel, data[0].Gender || data[0].gender);
          break;
        }
      }
      
      // Ultra fast selection delay (5-10ms)
      await new Promise(r => setTimeout(r, 5 + Math.random() * 5));
      
      // Fill tourist type for specific visitor
      const touristSelectors = [
        `select[name="data[dataGrid1][${visitorIndex}][touristType]"]`,
        `select[name*="[${visitorIndex}][touristType]"]`,
        '#e97ct9l-touristType', 
        'select[name="touristType"]', 
        'select[name="TouristType"]'
      ];
      for (let sel of touristSelectors) {
        if (document.querySelector(sel)) {
          await humanSelectDropdown(sel, data[0].TouristType || data[0].touristType);
          break;
        }
      }
      
      // Ultra fast selection delay (5-10ms)
      await new Promise(r => setTimeout(r, 5 + Math.random() * 5));
      
      // Fill ID type for specific visitor
      const idTypeSelectors = [
        `select[name="data[dataGrid1][${visitorIndex}][idType]"]`,
        `select[name*="[${visitorIndex}][idType]"]`,
        '#e1vd6ue-idType', 
        'select[name="idType"]', 
        'select[name="IDType"]'
      ];
      for (let sel of idTypeSelectors) {
        if (document.querySelector(sel)) {
          await humanSelectDropdown(sel, data[0].IDType || data[0].idType);
          break;
        }
      }
      
      // Ultra fast selection delay (5-10ms)
      await new Promise(r => setTimeout(r, 5 + Math.random() * 5));
      
      // Fill ID value for specific visitor
      const idValueSelectors = [
        `input[name="data[dataGrid1][${visitorIndex}][idValue]"]`,
        `input[name*="[${visitorIndex}][idValue]"]`,
        '#eroekh-idValue', 
        'input[name="idValue"]', 
        'input[name="IDValue"]'
      ];
      for (let sel of idValueSelectors) {
        if (document.querySelector(sel)) {
          await humanType(sel, data[0].IDValue || data[0].idValue);
          break;
        }
      }
      
      // Ultra fast selection delay (5-10ms)
      await new Promise(r => setTimeout(r, 5 + Math.random() * 5));
      
      // Fill age for specific visitor
      const ageSelectors = [
        `input[name="data[dataGrid1][${visitorIndex}][age]"]`,
        `input[name*="[${visitorIndex}][age]"]`,
        '#ewlk6gc-age', 
        'input[name="age"]', 
        'input[name="Age"]', 
        'input[placeholder*="age" i]'
      ];
      for (let sel of ageSelectors) {
        if (document.querySelector(sel)) {
          await humanType(sel, data[0].Age || data[0].age);
          break;
        }
      }

      // Show success banner
    const banner = document.createElement("div");
      banner.innerText = `✅ Visitor ${visitorIndex + 1} filled successfully!`;
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
        background: linear-gradient(45deg, #10b981, #059669);
      color: white;
        padding: 15px 25px;
        border-radius: 8px;
      z-index: 99999;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 5000);
      
      // Mark as completed
      isCompleted = true;
      completedVisitors.set(visitorIndex, Date.now());
      
      console.log(`✅ Auto-fill completed successfully for visitor ${visitorIndex + 1}!`);
      
      // Stop here - don't continue processing
      return;
      
  } catch (err) {
    console.error("❌ Autofill failed:", err);
      
      // Show error banner
      const banner = document.createElement("div");
      banner.innerText = "❌ Auto-fill failed: " + err.message;
      banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(45deg, #ef4444, #dc2626);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 99999;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 5000);
      
      // Stop here on error too
      return;
    }
  }
});

console.log("📦 content.js loaded on:", window.location.hostname);
console.log("🔍 Current URL:", window.location.href);

// Restore site functionality on page load
restoreSiteFunctionality();

// Cleanup scroll prevention on page load
cleanupScrollPrevention();

// Function to wait for all selectors to be available
function waitForAllSelectors(selectors, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    
    const checkSelectors = () => {
      const allFound = selectors.every(selector => {
        const elements = document.querySelectorAll(selector);
        return elements.length > 0;
      });
      
      if (allFound) {
        resolve();
        return;
      }
      
      if (Date.now() - start > timeout) {
        reject(new Error(`Timeout waiting for selectors: ${selectors.join(', ')}`));
        return;
      }
      
      setTimeout(checkSelectors, 100);
    };
    
    checkSelectors();
  });
}

// Restore normal site functionality
function restoreSiteFunctionality() {
  // Remove any CSS overrides
  const existingStyles = document.querySelectorAll('style');
  existingStyles.forEach(style => {
    if (style.textContent.includes('overflow') || style.textContent.includes('!important')) {
      style.remove();
    }
  });
  
  // Remove any event listeners that might interfere
  const events = ['click', 'submit', 'change', 'input', 'mousedown', 'mouseup', 'keydown', 'keyup'];
  events.forEach(eventType => {
    window.removeEventListener(eventType, null, true);
    window.removeEventListener(eventType, null, false);
    document.removeEventListener(eventType, null, true);
    document.removeEventListener(eventType, null, false);
  });
  
  // Restore normal event handling
  if (window.addEventListener) {
    // Ensure normal event handling is restored
    console.log("🔧 Normal event handling restored");
  }
  
  console.log("🔧 Site functionality restored");
}

// Cleanup any existing scroll prevention
function cleanupScrollPrevention() {
  // Remove any scroll event listeners that might be preventing scroll
  const scrollEvents = ['scroll', 'wheel', 'touchmove'];
  scrollEvents.forEach(eventType => {
    // Remove all scroll-related event listeners
    window.removeEventListener(eventType, null, true);
    window.removeEventListener(eventType, null, false);
    document.removeEventListener(eventType, null, true);
    document.removeEventListener(eventType, null, false);
  });
  
  // Remove any CSS overrides added by extension
  const existingStyles = document.querySelectorAll('style');
  existingStyles.forEach(style => {
    if (style.textContent.includes('overflow') || style.textContent.includes('!important')) {
      style.remove();
    }
  });
  
  console.log("🔓 Scroll prevention cleaned up");
}
