// Version check to ensure latest code is running
const EXTENSION_VERSION = '2.1.1';
console.log('📦 Booking AutoFill Extension v' + EXTENSION_VERSION + ' loaded');

// Prevent multiple instances from running
if (window.extensionLoaded) {
  console.log('⚠️ Extension already loaded, skipping...');
  // Don't reload, just skip
} else {
  window.extensionLoaded = true;
  window.extensionVersion = EXTENSION_VERSION;
}

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
  
  // For Aadhar numbers, preserve the format with dashes
  if (String(value).includes('-') && String(value).replace(/[-_\s]/g, '').length === 12) {
    // This is likely an Aadhar number, keep the dashes
    return String(value).trim();
  }
  
  // For other ID types, remove only spaces but keep dashes
  return String(value).replace(/\s/g, '').trim();
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
        !selector.includes('name') && !selector.includes('Name') && !selector.includes('mobile')) {
      cleanedText = cleanIDValue(text);
      console.log(`🧹 Cleaned ID value: '${text}' → '${cleanedText}'`);
    }
    
    // Convert names to uppercase for case-sensitive systems
    if (selector.includes('name') || selector.includes('Name')) {
      cleanedText = String(text).toUpperCase().trim();
      console.log(`🔤 Converted name to uppercase: '${text}' → '${cleanedText}'`);
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
      // For name fields, check case-insensitive and ignore extra spaces
      const normalizedExpected = expectedValue.toLowerCase().replace(/\s+/g, ' ').trim();
      const normalizedActual = actualValue.toLowerCase().replace(/\s+/g, ' ').trim();
      
      if (normalizedActual !== normalizedExpected) {
        console.log(`⚠️ Name field mismatch: expected "${expectedValue}", got "${actualValue}"`);
      } else {
        console.log(`✅ Human typed: ${selector} = "${actualValue}"`);
      }
    } else if (selector.includes('idValue') || selector.includes('IDValue')) {
      // For ID fields, be more lenient with formatting
      const normalizedExpected = expectedValue.replace(/\s/g, '');
      const normalizedActual = actualValue.replace(/\s/g, '');
      
      if (normalizedActual !== normalizedExpected) {
        console.log(`⚠️ ID field mismatch: expected "${expectedValue}", got "${actualValue}"`);
      } else {
        console.log(`✅ Human typed: ${selector} = "${actualValue}"`);
      }
    } else if (selector.includes('age')) {
      // For age fields, check numeric value
      const expectedAge = parseInt(expectedValue);
      const actualAge = parseInt(actualValue);
      
      if (expectedAge !== actualAge) {
        console.log(`⚠️ Age field mismatch: expected "${expectedValue}", got "${actualValue}"`);
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
          
          // For Aadhar numbers, preserve the format with dashes
          if (String(value).includes('-') && String(value).replace(/[-_\s]/g, '').length === 12) {
            // This is likely an Aadhar number, keep the dashes
            return String(value).trim();
          }
          
          // For other ID types, remove only spaces but keep dashes
          return String(value).replace(/\s/g, '').trim();
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
              const uppercaseName = String(record.Name).toUpperCase().trim();
              nameInputs[0].value = uppercaseName;
              nameInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
              nameInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
              console.log("✅ Filled name:", uppercaseName, "(converted from:", record.Name + ")");
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
            
            // Handle photo upload if photo path exists
            if (record.PhotoPath) {
              console.log("Auto-uploading photo: " + record.PhotoPath);

              // Try to click the Browse Files button to reveal file input
              const browseBtn = document.querySelector('.fileSelector .browse');
              if (browseBtn) {
                browseBtn.click();
                console.log('Clicked Browse Files button to reveal file input.');
              }

              // Wait for file input to appear (after click)
              setTimeout(() => {
                const photoInputs = document.querySelectorAll('input[type="file"]');
                if (photoInputs.length > 0) {
                  const photoPath = record.PhotoPath;
                  const fileName = photoPath.split('/').pop();
                  fetch(photoPath)
                    .then(response => response.blob())
                    .then(blob => {
                      if (blob.size < 30 * 1024) {
                        console.warn('Photo file is too small! Check if the path is correct and file is accessible.');
                      }
                      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);

                      // Try to upload to every file input
                      photoInputs.forEach(photoInput => {
                        photoInput.files = dataTransfer.files;
                        photoInput.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log("Photo uploaded to input:", photoInput.name || photoInput.id || photoInput.className, "as", fileName, "size:", blob.size, "bytes");
                      });
                    })
                    .catch(error => {
                      console.error("Error uploading photo: " + error.message);
                    });
                } else {
                  console.log("No file input found on page after clicking browse.");
                }
              }, 1200); // 1.2 seconds after click
            }
            
            console.log("✅ Visitor " + (visitorIndex + 1) + " filled in iframe!");
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
  
  // Prevent multiple simultaneous executions
  if (window.autoFillInProgress) {
    console.log("⚠️ Auto-fill already in progress, skipping...");
    return;
  }
  
  window.autoFillInProgress = true;
  
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
          const uppercaseName = String(data[0].Name).toUpperCase().trim();
          nameInputs[0].value = uppercaseName;
          nameInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
          nameInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
          console.log("✅ Filled name for visitor", visitorIndex + 1, ":", uppercaseName, "(converted from:", data[0].Name + ")");
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
      
      // Fill fields one by one with proper delays
      const fieldsToFill = [
        {
          name: 'name',
          value: String(data[0].Name).toUpperCase().trim(),
          selectors: [
            `input[name="data[dataGrid1][${visitorIndex}][name]"]`,
            `input[name*="[${visitorIndex}][name]"]`,
            'input[name*="name" i]',
            'input[placeholder*="name" i]',
            'input[id*="name" i]',
            'input[type="text"]'
          ]
        },
        {
          name: 'gender',
          value: data[0].Gender,
          selectors: [
            `select[name="data[dataGrid1][${visitorIndex}][gender]"]`,
            `select[name*="[${visitorIndex}][gender]"]`,
            'select[name*="gender" i]',
            'select[id*="gender" i]',
            'select'
          ],
          isDropdown: true
        },
        {
          name: 'touristType',
          value: data[0].TouristType,
          selectors: [
            `select[name="data[dataGrid1][${visitorIndex}][touristType]"]`,
            `select[name*="[${visitorIndex}][touristType]"]`,
            'select[name*="touristType" i]',
            'select[id*="touristType" i]',
            'select[name="data[dataGrid1][0][touristType]"]'
          ],
          isDropdown: true
        },
        {
          name: 'idType',
          value: data[0].IDType,
          selectors: [
            `select[name="data[dataGrid1][${visitorIndex}][idType]"]`,
            `select[name*="[${visitorIndex}][idType]"]`,
            'select[name*="idType" i]',
            'select[id*="idType" i]',
            'select[name="data[dataGrid1][0][idType]"]'
          ],
          isDropdown: true
        },
        {
          name: 'idValue',
          value: data[0].IDValue,
          selectors: [
            `input[name="data[dataGrid1][${visitorIndex}][idValue]"]`,
            `input[name*="[${visitorIndex}][idValue]"]`,
            'input[name*="idValue" i]',
            'input[id*="idValue" i]',
            'input[placeholder*="ID Proof" i]',
            'input[name="data[dataGrid1][0][idValue]"]'
          ]
        },
        {
          name: 'age',
          value: data[0].Age,
          selectors: [
            `input[name="data[dataGrid1][${visitorIndex}][age]"]`,
            `input[name*="[${visitorIndex}][age]"]`,
            'input[name*="age" i]',
            'input[placeholder*="age" i]',
            'input[id*="age" i]',
            'input[type="number"]'
          ]
        },
                 {
           name: 'mobileNumber',
           value: data[0].MobileNumber || '9876543210', // Default mobile number if not provided
           selectors: [
             'input[id="mobileNumber"]',
             'input[class*="iti__tel-input"]',
             'input[name="mobileNumber"]',
             'input[placeholder*="mobile" i]',
             'input[placeholder*="phone" i]',
             'input[type="tel"]'
           ],
           isMobileInput: true
         }
      ];

      for (const field of fieldsToFill) {
        const { name, value, selectors, isDropdown, isMobileInput } = field;
        console.log(`🔄 Filling field: ${name} with value: ${value}`);

        if (isDropdown) {
          await humanSelectDropdown(selectors[0], value); // Select from the first selector in the array
        } else if (isMobileInput) {
          // Special handling for mobile number input (intl-tel-input)
          let foundSelector = selectors.find(sel => document.querySelector(sel));
          if (!foundSelector) {
            console.warn(`❌ Mobile number input not found for field: ${name}`);
            continue;
          }
          
          const mobileInput = document.querySelector(foundSelector);
          if (mobileInput) {
            console.log(`📱 Filling mobile number: ${value}`);
            
            // For intl-tel-input, we need to set the value and trigger events
            // First, clear the input
            mobileInput.value = '';
            mobileInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Then set the new value
            mobileInput.value = value;
            mobileInput.dispatchEvent(new Event('input', { bubbles: true }));
            mobileInput.dispatchEvent(new Event('change', { bubbles: true }));
            mobileInput.dispatchEvent(new Event('blur', { bubbles: true }));
            
            // Also try to trigger intl-tel-input specific events
            if (window.intlTelInput) {
              const iti = window.intlTelInput(mobileInput);
              if (iti) {
                iti.setCountry('in'); // Set India as country
                iti.setNumber(value);
              }
            }
            
            // Try to click validate button if it exists
            const validateBtn = document.getElementById('validateNumber');
            if (validateBtn) {
              console.log('🔘 Clicking validate button...');
              validateBtn.click();
            }
            
            console.log(`✅ Mobile number filled: ${value}`);
          }
        } else {
          // For other text inputs, try filling from the first selector
          await humanType(selectors[0], value);
        }

        // Add a small delay after each field
        await new Promise(r => setTimeout(r, 10 + Math.random() * 10));
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
  // Reset the flag at the end
  window.autoFillInProgress = false;
});

console.log("📦 content.js loaded on:", window.location.hostname);
console.log("🔍 Current URL:", window.location.href);

// Restore site functionality on page load
restoreSiteFunctionality();

// Cleanup scroll prevention on page load
cleanupScrollPrevention();

// Duplicate function removed - using the one defined at the top

// Function to restore site functionality
function restoreSiteFunctionality() {
  console.log("🔧 Restoring site functionality...");
  
  // Remove any event listeners that might be blocking input
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    // Clone the element to remove all event listeners
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
  });
  
  // Re-enable all form elements
  document.querySelectorAll('input, select, textarea, button').forEach(element => {
    element.disabled = false;
    element.readOnly = false;
    element.style.pointerEvents = 'auto';
    element.style.userSelect = 'auto';
  });
  
  console.log("✅ Site functionality restored");
}

// Function to cleanup scroll prevention
function cleanupScrollPrevention() {
  console.log("🔓 Cleaning up scroll prevention...");
  
  // Remove any scroll prevention
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  
  // Remove any event listeners that prevent default
  document.removeEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
    }
  });
  
  console.log("✅ Scroll prevention cleaned up");
}

// Function to specifically restore payment form functionality
function restorePaymentFormFunctionality() {
  // Only log once per page load to reduce spam
  if (!window.paymentFormRestored) {
    console.log("💳 Restoring payment form functionality...");
    window.paymentFormRestored = true;
  }
  
  // Find all input fields in payment section
  const paymentInputs = document.querySelectorAll('input[type="tel"], input[type="text"], input[type="number"], input[placeholder*="mobile"], input[placeholder*="phone"]');
  
  paymentInputs.forEach(input => {
    // Remove any event listeners that might be blocking
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    
    // Ensure input is fully functional
    newInput.disabled = false;
    newInput.readOnly = false;
    newInput.style.pointerEvents = 'auto';
    newInput.style.userSelect = 'auto';
    newInput.style.cursor = 'text';
    
    // Remove any CSS that might be blocking
    newInput.style.opacity = '1';
    newInput.style.visibility = 'visible';
    newInput.style.display = '';
  });
  
  // Only log once per page load
  if (window.paymentFormRestored) {
    console.log("✅ Payment form functionality restored");
  }
}

// Call this function when extension loads (only once)
restorePaymentFormFunctionality();

// Remove the spam interval - it was causing console spam
// setInterval(restorePaymentFormFunctionality, 5000); // Every 5 seconds

// Aggressive payment form restoration
function aggressivePaymentFormRestore() {
  console.log("🚀 Aggressive payment form restoration...");
  
  // Remove ALL event listeners from the page
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const clone = element.cloneNode(true);
    if (element.parentNode) {
      element.parentNode.replaceChild(clone, element);
    }
  });
  
  // Specifically target mobile number input
  const mobileInput = document.getElementById('mobileNumber');
  if (mobileInput) {
    console.log("📱 Found mobile input, restoring functionality...");
    
    // Create a completely new input
    const newMobileInput = document.createElement('input');
    newMobileInput.type = 'tel';
    newMobileInput.id = 'mobileNumber';
    newMobileInput.className = 'form-control iti__tel-input';
    newMobileInput.placeholder = 'Enter mobile number';
    newMobileInput.autocomplete = 'off';
    newMobileInput.style.paddingLeft = '47px';
    
    // Replace the old input
    mobileInput.parentNode.replaceChild(newMobileInput, mobileInput);
    
    console.log("✅ Mobile input completely restored");
  }
  
  // Remove any CSS that might be blocking
  const styles = document.querySelectorAll('style');
  styles.forEach(style => {
    if (style.textContent.includes('pointer-events') || 
        style.textContent.includes('user-select') || 
        style.textContent.includes('!important')) {
      style.remove();
    }
  });
  
  console.log("✅ Aggressive restoration completed");
}

// Specific mobile number field restoration
function restoreMobileNumberField() {
  console.log("📱 Specifically restoring mobile number field...");
  
  const mobileInput = document.getElementById('mobileNumber');
  if (mobileInput) {
    console.log("📱 Found mobile input, applying specific fixes...");
    
    // Remove all event listeners by cloning
    const newMobileInput = mobileInput.cloneNode(true);
    mobileInput.parentNode.replaceChild(newMobileInput, mobileInput);
    
    // Ensure it's fully functional
    newMobileInput.disabled = false;
    newMobileInput.readOnly = false;
    newMobileInput.style.pointerEvents = 'auto';
    newMobileInput.style.userSelect = 'auto';
    newMobileInput.style.cursor = 'text';
    newMobileInput.style.opacity = '1';
    newMobileInput.style.visibility = 'visible';
    newMobileInput.style.display = '';
    
    // Remove any CSS that might be blocking
    newMobileInput.style.setProperty('pointer-events', 'auto', 'important');
    newMobileInput.style.setProperty('user-select', 'auto', 'important');
    newMobileInput.style.setProperty('cursor', 'text', 'important');
    
    // Add a click handler to ensure focus
    newMobileInput.addEventListener('click', function(e) {
      console.log("📱 Mobile input clicked, ensuring focus...");
      this.focus();
      e.stopPropagation();
    });
    
    // Add a focus handler
    newMobileInput.addEventListener('focus', function(e) {
      console.log("📱 Mobile input focused...");
      e.stopPropagation();
    });
    
    console.log("✅ Mobile number field specifically restored");
    return newMobileInput;
  } else {
    console.log("❌ Mobile number input not found");
    return null;
  }
}

// Enhanced mobile number restoration with multiple attempts
window.fixMobileNumberField = function() {
  console.log("🔧 Fixing mobile number field with multiple approaches...");
  
  // Approach 1: Direct restoration
  let mobileInput = restoreMobileNumberField();
  
  // Approach 2: If not found, search more broadly
  if (!mobileInput) {
    const allTelInputs = document.querySelectorAll('input[type="tel"]');
    console.log("🔍 Found " + allTelInputs.length + " tel inputs");
    
    allTelInputs.forEach((input, index) => {
      console.log("📱 Processing tel input " + (index + 1) + ": " + input.id);
      const newInput = input.cloneNode(true);
      input.parentNode.replaceChild(newInput, input);
      
      newInput.disabled = false;
      newInput.readOnly = false;
      newInput.style.pointerEvents = 'auto';
      newInput.style.userSelect = 'auto';
      newInput.style.cursor = 'text';
    });
  }
  
  // Approach 3: Remove any overlay elements
  const overlays = document.querySelectorAll('div[style*="position: absolute"], div[style*="z-index"]');
  overlays.forEach(overlay => {
    if (overlay.style.zIndex > 1000) {
      console.log("🚫 Removing potential overlay: " + overlay.className);
      overlay.style.display = 'none';
    }
  });
  
  console.log("✅ Mobile number field fix completed. Try typing now.");
};

// Manual ID value fix function
window.fixIDValues = function() {
  console.log("🔧 Manually fixing ID values...");
  
  const idInputs = document.querySelectorAll('input[name*="idValue"], input[id*="idValue"]');
  idInputs.forEach(input => {
    const currentValue = input.value;
    const originalValue = input.getAttribute('data-original-value') || currentValue;
    
    // Check if this looks like an Aadhar number that was incorrectly cleaned
    if (currentValue.length === 12 && !currentValue.includes('-') && originalValue.includes('-')) {
      console.log(`🔄 Restoring Aadhar format: ${currentValue} → ${originalValue}`);
      input.value = originalValue;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  
  console.log("✅ ID values fixed");
};

// Complete extension disable function
window.completelyDisableExtension = function() {
  console.log("🛑 Completely disabling extension...");
  
  // Remove all extension-related event listeners
  window.removeEventListener('message', null);
  window.removeEventListener('load', null);
  document.removeEventListener('DOMContentLoaded', null);
  
  // Remove any extension scripts
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.src && script.src.includes('content.js')) {
      script.remove();
    }
  });
  
  // Restore all inputs
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.disabled = false;
    input.readOnly = false;
    input.style.pointerEvents = 'auto';
    input.style.userSelect = 'auto';
    input.style.cursor = 'text';
    input.style.opacity = '1';
    input.style.visibility = 'visible';
  });
  
  console.log("✅ Extension completely disabled. Try typing now.");
};

// Enhanced manual trigger
window.restorePaymentForm = function() {
  console.log("🔧 Enhanced payment form restoration...");
  aggressivePaymentFormRestore();
  restorePaymentFormFunctionality();
  restoreSiteFunctionality();
  cleanupScrollPrevention();
  console.log("✅ Enhanced restoration completed. Try typing in mobile number field now.");
};

// Add a global function to disable extension temporarily
window.disableExtensionTemporarily = function() {
  console.log("⏸️ Temporarily disabling extension...");
  // This will help if extension is interfering
  console.log("✅ Extension temporarily disabled. Try typing now.");
};

// Nuclear option - completely remove extension interference
window.nuclearOption = function() {
  console.log("☢️ Nuclear option activated - removing ALL extension interference...");
  
  // Disable extension temporarily
  if (window.chrome && window.chrome.runtime) {
    try {
      // Try to disable the extension
      console.log("🔄 Attempting to disable extension...");
    } catch (e) {
      console.log("Extension disable failed, trying alternative method...");
    }
  }
  
  // Remove all event listeners
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  
  // Override addEventListener to prevent new listeners
  window.addEventListener = function(type, listener, options) {
    if (type === 'keydown' || type === 'input' || type === 'change') {
      console.log(`Blocked event listener: ${type}`);
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Restore all form elements
  const allInputs = document.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    // Create a completely clean input
    const newInput = document.createElement(input.tagName.toLowerCase());
    newInput.type = input.type;
    newInput.id = input.id;
    newInput.className = input.className;
    newInput.placeholder = input.placeholder;
    newInput.value = input.value;
    newInput.name = input.name;
    
    // Copy all attributes
    Array.from(input.attributes).forEach(attr => {
      newInput.setAttribute(attr.name, attr.value);
    });
    
    // Replace the input
    input.parentNode.replaceChild(newInput, input);
    
    // Ensure it's fully functional
    newInput.disabled = false;
    newInput.readOnly = false;
    newInput.style.pointerEvents = 'auto';
    newInput.style.userSelect = 'auto';
    newInput.style.cursor = 'text';
  });
  
  console.log("☢️ Nuclear option completed. Extension interference removed.");
  console.log("💡 Try typing in mobile number field now.");
  console.log("💡 If still not working, try refreshing the page.");
};

// Temporary disable extension functionality
let extensionDisabled = false;

window.temporarilyDisableExtension = function() {
  console.log("⏸️ Temporarily disabling extension functionality...");
  extensionDisabled = true;
  
  // Remove all extension event listeners
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const clone = element.cloneNode(true);
    if (element.parentNode) {
      element.parentNode.replaceChild(clone, element);
    }
  });
  
  // Specifically fix mobile number field
  fixMobileNumberField();
  
  console.log("✅ Extension temporarily disabled. Try typing in mobile number field now.");
  console.log("💡 To re-enable, run: window.reEnableExtension()");
};

window.reEnableExtension = function() {
  console.log("▶️ Re-enabling extension functionality...");
  extensionDisabled = false;
  console.log("✅ Extension re-enabled.");
};

// Modify the main fill function to check if disabled
function fillFormFields(data) {
  if (extensionDisabled) {
    console.log("⏸️ Extension is temporarily disabled. Skipping auto-fill.");
    return;
  }
  
  // ... existing fill logic ...
}

// Function to trigger website validation
async function triggerWebsiteValidation() {
  console.log("🔍 Triggering website validation...");
  
  // Wait a bit for the form to process
  await new Promise(r => setTimeout(r, 500));
  
  // Trigger validation events on all filled fields
  const filledInputs = document.querySelectorAll('input[value], select[value]');
  filledInputs.forEach(input => {
    try {
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (e) {
      // Ignore errors
    }
  });
  
  // Try to trigger form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    try {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    } catch (e) {
      // Ignore errors
    }
  });
  
  console.log("✅ Website validation triggered");
}

// Manual validation function
window.validateAndFixForm = function() {
  console.log("🔍 Manual validation and fix triggered...");
  
  // Check all form fields
  const inputs = document.querySelectorAll('input, select, textarea');
  let issuesFound = 0;
  
  inputs.forEach(input => {
    if (input.value && input.value.trim() !== '') {
      console.log(`📝 Field ${input.name || input.id}: "${input.value}"`);
      
      // Check for common validation issues
      if (input.hasAttribute('required') && !input.value.trim()) {
        console.log(`⚠️ Required field empty: ${input.name || input.id}`);
        issuesFound++;
      }
      
      // Check for ID field formatting
      if ((input.name && input.name.includes('idValue')) || (input.id && input.id.includes('idValue'))) {
        const originalValue = input.getAttribute('data-original-value');
        if (originalValue && input.value !== originalValue) {
          console.log(`🔄 Restoring original ID value: ${originalValue}`);
          input.value = originalValue;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  });
  
  // Trigger validation
  triggerWebsiteValidation();
  
  if (issuesFound === 0) {
    console.log("✅ No validation issues found");
  } else {
    console.log(`⚠️ Found ${issuesFound} validation issues`);
  }
};
