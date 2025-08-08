// Load saved data if present
chrome.storage.local.get(["bookingData", "excelData", "lastFileName"], (res) => {
    const data = res.bookingData || res.excelData;
    if (data) {
      document.getElementById('status').innerText = "ℹ️ Excel already loaded, ready to use.";
      document.getElementById('status').className = "info";
      document.getElementById('fileName').innerText = `📁 ${res.lastFileName || "File loaded"}`;
      document.getElementById('startBtn').disabled = false;
      document.getElementById('manualBtn').disabled = false;
      
      // Update the auto-loading message to show already loaded
      const autoLoadMsg = document.querySelector('.card div[style*="text-align: center"]');
      if (autoLoadMsg) {
        autoLoadMsg.textContent = `✅ Already loaded ${data.length} records from ${res.lastFileName || "data.xlsx"}`;
        autoLoadMsg.style.color = "#4ade80";
      }
      
      // Populate user selection dropdown
      populateUserSelection(data);
    } else {
      // Auto-load data.xlsx if no saved data exists
      autoLoadExcelFile();
    }
  });
  
  // Function to automatically load data.xlsx
  async function autoLoadExcelFile() {
    try {
      updateStatus("🔄 Auto-loading data.xlsx...", "info");
      
      // Update the auto-loading message
      const autoLoadMsg = document.querySelector('.card div[style*="text-align: center"]');
      if (autoLoadMsg) {
        autoLoadMsg.textContent = "🔄 Auto-loading data.xlsx...";
      }
      
      // Fetch the data.xlsx file from the extension directory
      const response = await fetch(chrome.runtime.getURL('data.xlsx'));
      if (!response.ok) {
        throw new Error(`Failed to fetch data.xlsx: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        updateStatus("❌ No data found in data.xlsx", "error");
        return;
      }

      // Store data and show user selection
      chrome.storage.local.set({ excelData: jsonData, bookingData: jsonData, lastFileName: "data.xlsx" }, () => {
        updateStatus(`✅ Auto-loaded ${jsonData.length} records from data.xlsx`, "success");
        document.getElementById('fileName').textContent = "📁 data.xlsx (Auto-loaded)";
        document.getElementById('startBtn').disabled = false;
        document.getElementById('manualBtn').disabled = false;
        
        // Update the auto-loading message to success
        const autoLoadMsg = document.querySelector('.card div[style*="text-align: center"]');
        if (autoLoadMsg) {
          autoLoadMsg.textContent = `✅ Auto-loaded ${jsonData.length} records from data.xlsx`;
          autoLoadMsg.style.color = "#4ade80";
        }
        
        // Show user selection
        populateUserSelection(jsonData);
      });
    } catch (error) {
      updateStatus("❌ Error auto-loading data.xlsx: " + error.message, "error");
      console.error("Auto-load error:", error);
      
      // Update the auto-loading message to error
      const autoLoadMsg = document.querySelector('.card div[style*="text-align: center"]');
      if (autoLoadMsg) {
        autoLoadMsg.textContent = "❌ Error auto-loading data.xlsx";
        autoLoadMsg.style.color = "#f87171";
      }
    }
  }
  
  // Check for existing data on page load
  chrome.storage.local.get(['excelData', 'bookingData'], (result) => {
    const data = result.bookingData || result.excelData;
    if (data && data.length > 0) {
      updateStatus(`✅ Found ${data.length} records from previous session`, "success");
      document.getElementById('startBtn').disabled = false;
      document.getElementById('manualBtn').disabled = false;
      
      // Show user selection for existing data
      populateUserSelection(data);
      
      // Set default visitor selection
      const visitorSelect = document.getElementById('visitorSelect');
      const visitorInfo = document.getElementById('visitorInfo');
      if (visitorSelect && visitorInfo) {
        visitorSelect.value = '0';
        visitorInfo.textContent = 'Currently filling: Visitor 1';
      }
    }
  });
  
  // Excel file upload handler (kept for manual override)
  document.getElementById('excelFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        if (jsonData.length === 0) {
          updateStatus("❌ No data found in Excel file", "error");
          return;
        }
  
        // Store data and show user selection
        chrome.storage.local.set({ excelData: jsonData, bookingData: jsonData, lastFileName: file.name }, () => {
          updateStatus(`✅ Loaded ${jsonData.length} records from Excel`, "success");
          document.getElementById('fileName').textContent = file.name;
          document.getElementById('startBtn').disabled = false;
          document.getElementById('manualBtn').disabled = false;
          
          // Show user selection
          populateUserSelection(jsonData);
        });
      } catch (error) {
        updateStatus("❌ Error reading Excel file: " + error.message, "error");
      }
    };
    reader.readAsArrayBuffer(file);
  });
  
  // Function to populate user selection dropdown
  function populateUserSelection(data) {
    const userSelect = document.getElementById('userSelect');
    const userInfo = document.getElementById('userInfo');
    const visitorSelection = document.querySelector('.visitor-selection');
    const visitorSelect = document.getElementById('visitorSelect');
    const visitorInfo = document.getElementById('visitorInfo');
    
    // Clear existing options
    userSelect.innerHTML = '<option value="">Choose a user...</option>';
    
    // Add options for each user
    data.forEach((user, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${index + 1}. ${user.Name || 'Unknown'}`;
      userSelect.appendChild(option);
    });
    
    // Show user selection
    document.querySelector('.user-selection').style.display = 'block';
    visitorSelection.style.display = 'block';
    
    // Set default visitor selection
    visitorSelect.value = '0';
    visitorInfo.textContent = 'Currently filling: Visitor 1';
    
    // Add event listener for user selection
    userSelect.addEventListener('change', () => {
      const selectedIndex = parseInt(userSelect.value);
      if (selectedIndex >= 0 && data[selectedIndex]) {
        const user = data[selectedIndex];
        userInfo.innerHTML = `
          <strong>Selected User:</strong><br>
          Name: ${user.Name}<br>
          Gender: ${user.Gender}<br>
          Tourist Type: ${user.TouristType}<br>
          ID Type: ${user.IDType}<br>
          ID Value: ${user.IDValue}<br>
          Age: ${user.Age}${user.PhotoPath ? `<br>📸 Photo: ${user.PhotoPath}` : ''}
        `;
      }
    });
    
    // Add event listener for visitor selection
    visitorSelect.addEventListener('change', () => {
      const selectedVisitor = parseInt(visitorSelect.value);
      visitorInfo.textContent = `Currently filling: Visitor ${selectedVisitor + 1}`;
    });
    
    // Show first user's info by default
    if (data.length > 0) {
      userInfo.innerHTML = `
        <strong>Selected User:</strong><br>
        Name: ${data[0].Name}<br>
        Gender: ${data[0].Gender}<br>
        Tourist Type: ${data[0].TouristType}<br>
        ID Type: ${data[0].IDType}<br>
        ID Value: ${data[0].IDValue}<br>
        Age: ${data[0].Age}${data[0].PhotoPath ? `<br>📸 Photo: ${data[0].PhotoPath}` : ''}
      `;
    }
  }
  
  // Start button
  document.getElementById('startBtn').addEventListener('click', () => {
    updateStatus("🚀 Starting auto-fill...", "info");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.storage.local.get(["bookingData", "excelData"], (res) => {
        const data = res.bookingData || res.excelData;
        if (!data || data.length === 0) {
          updateStatus("❌ No data available. Please upload Excel file first.", "error");
          return;
        }

        const userSelect = document.getElementById('userSelect');
        const visitorSelect = document.getElementById('visitorSelect');
        
        const selectedUserIndex = parseInt(userSelect.value);
        const selectedVisitorIndex = parseInt(visitorSelect.value);
        
        if (selectedUserIndex < 0 || selectedUserIndex >= data.length) {
          updateStatus("❌ Please select a valid user from the dropdown.", "error");
          return;
        }
        
        if (selectedVisitorIndex < 0) {
          updateStatus("❌ Please select a valid visitor number.", "error");
          return;
        }

        const selectedData = [data[selectedUserIndex]]; // Send only selected user
        const visitorIndex = selectedVisitorIndex; // Send visitor index

        updateStatus("🚀 Sending auto-fill data to content script...", "info");

        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id, allFrames: true },
          func: function(selectedData, visitorIndex) {
            // Disable any existing MutationObserver to prevent infinite spam
            if (window.formObserver) {
              window.formObserver.disconnect();
              console.log("🔒 Existing form observer disabled");
            }
            
            // Disable any other observers
            if (window.observers) {
              window.observers.forEach(observer => observer.disconnect());
              console.log("🔒 All existing observers disabled");
            }
            
            // Disable all MutationObservers globally
            const allObservers = document.querySelectorAll('*');
            allObservers.forEach(element => {
              if (element._mutationObserver) {
                element._mutationObserver.disconnect();
              }
            });
            console.log("🔒 All global observers disabled");
            
            // Reset completion flags
            window.formFillingCompleted = window.formFillingCompleted || {};
            window.lastFormCompletion = window.lastFormCompletion || {};
            
            // Only reset for the current visitor
            const visitorKey = `visitor_${visitorIndex}`;
            delete window.formFillingCompleted[visitorKey];
            delete window.lastFormCompletion[visitorKey];
            
            // Spam prevention - disable console if too many messages
            let messageCount = 0;
            const originalConsoleLog = console.log;
            console.log = function(...args) {
              messageCount++;
              if (messageCount > 50) {
                console.log = function() {}; // Disable console logging
                console.warn("🔇 Console logging disabled due to spam");
                return;
              }
              originalConsoleLog.apply(console, args);
            };

            console.log("🚀 Sending auto-fill data to content script...");
            window.postMessage({ type: "AUTO_FILL", payload: data, visitorIndex: visitorIndex }, "*");
          },
          args: [selectedData, visitorIndex]
        });
      });
    });
  });

  // Manual trigger button
  document.getElementById('manualBtn').addEventListener('click', () => {
    updateStatus("🔧 Manual trigger activated...", "info");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.storage.local.get(["bookingData", "excelData"], (res) => {
        const data = res.bookingData || res.excelData;
        if (!data || data.length === 0) {
          updateStatus("❌ No data available. Please upload Excel file first.", "error");
          return;
        }

        const userSelect = document.getElementById('userSelect');
        const visitorSelect = document.getElementById('visitorSelect');
        
        const selectedUserIndex = parseInt(userSelect.value);
        const selectedVisitorIndex = parseInt(visitorSelect.value);
        
        if (selectedUserIndex < 0 || selectedUserIndex >= data.length) {
          updateStatus("❌ Please select a valid user from the dropdown.", "error");
          return;
        }
        
        if (selectedVisitorIndex < 0) {
          updateStatus("❌ Please select a valid visitor number.", "error");
          return;
        }

        const selectedData = [data[selectedUserIndex]]; // Send only selected user
        const visitorIndex = selectedVisitorIndex; // Send visitor index

        updateStatus("🚀 Sending auto-fill data to content script...", "info");
  
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id, allFrames: true },
          func: (data, visitorIndex) => {
            console.log("🔧 Manual trigger: Analyzing page for form fields...");
            console.log("👤 Selected visitor index:", visitorIndex);
            
            // Aggressive security script suppression
            try {
              // Override global error handler
              window.addEventListener('error', function(e) {
                if (e.filename && e.filename.includes('security.js')) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }, true);
              
              // Override unhandledrejection
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.toString().includes('security.js')) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Override console.error to suppress security.js errors
              const originalConsoleError = console.error;
              console.error = function(...args) {
                const message = args.join(' ');
                if (message.includes('security.js') || 
                    message.includes('toLowerCase') || 
                    message.includes('Cannot read properties')) {
                  return; // Suppress security.js errors completely
                }
                originalConsoleError.apply(console, args);
              };
              
              // Override console.warn to suppress security.js warnings
              const originalConsoleWarn = console.warn;
              console.warn = function(...args) {
                const message = args.join(' ');
                if (message.includes('security.js') || 
                    message.includes('toLowerCase') || 
                    message.includes('Cannot read properties')) {
                  return; // Suppress security.js warnings completely
                }
                originalConsoleWarn.apply(console, args);
              };
              
              // Block security.js script execution
              const originalCreateElement = document.createElement;
              document.createElement = function(tagName) {
                const element = originalCreateElement.call(document, tagName);
                if (tagName.toLowerCase() === 'script') {
                  const originalSetAttribute = element.setAttribute;
                  element.setAttribute = function(name, value) {
                    if (name === 'src' && value.includes('security.js')) {
                      return; // Block security.js script loading
                    }
                    originalSetAttribute.call(this, name, value);
                  };
                }
                return element;
              };
              
            } catch (e) {
              console.log("🔒 Security suppression setup completed");
            }
            
            // Function to clean ID values (remove dashes, spaces, etc.)
            function cleanIDValue(value) {
              if (!value) return value;
              // Remove only dashes, spaces, and other separators, keep letters and numbers
              return String(value).replace(/[-_\s]/g, '');
            }

            // Human-like typing function
            async function humanType(element, text) {
              try {
                // Clean ID values if it's an ID field (not name fields)
                let cleanedText = text;
                if (element.name && (element.name.includes('idValue') || element.name.includes('IDValue') || element.name.includes('id') || element.name.includes('ID')) && 
                    !element.name.includes('name') && !element.name.includes('Name')) {
                  cleanedText = cleanIDValue(text);
                  console.log(`🧹 Cleaned ID value: '${text}' → '${cleanedText}'`);
                }
                
                // Convert names to uppercase for case-sensitive systems
                if (element.name && (element.name.includes('name') || element.name.includes('Name'))) {
                  cleanedText = String(text).toUpperCase().trim();
                  console.log(`🔤 Converted name to uppercase: '${text}' → '${cleanedText}'`);
                }
                
                console.log(`📝 Human typing '${cleanedText}' into ${element.tagName}`);
                
                // Focus the element first
                element.focus();
                element.click();
                
                // Ultra fast start - minimal delay before typing (10-30ms)
                await new Promise(r => setTimeout(r, 10 + Math.random() * 20));
                
                // Clear existing value
                element.value = "";
                
                // Type character by character with ultra-fast delays
                const textToType = String(cleanedText).trim();
                for (let i = 0; i < textToType.length; i++) {
                  const char = textToType[i];
                  
                  // Add character
                  element.value += char;
                  
                  // Dispatch input event for each character
                  try {
                    element.dispatchEvent(new Event("input", { bubbles: true }));
                  } catch (e) {
                    // Ignore security script errors
                  }
                  
                  // Ultra fast delay between characters (5-15ms)
                  await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
                  
                  // Rarely add a tiny pause (minimal thinking)
                  if (Math.random() < 0.02) {
                    await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
                  }
                }
                
                // Ultra fast completion - minimal delay after typing (5-15ms)
                await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
                
                // Dispatch final events
                try {
                  element.dispatchEvent(new Event("change", { bubbles: true }));
                  element.dispatchEvent(new Event("blur", { bubbles: true }));
                } catch (e) {
                  // Ignore security script errors
                }
                
                // Check if value was set correctly
                const expectedValue = String(cleanedText).trim();
                const actualValue = element.value;
                
                if (element.name && element.name.includes('name')) {
                  // For name fields, check case-insensitive
                  if (actualValue.toLowerCase() !== expectedValue.toLowerCase()) {
                    console.log(`⚠️ Name field case mismatch: expected "${expectedValue}", got "${actualValue}"`);
                  } else {
                    console.log(`✅ Human typed: ${element.tagName} = "${actualValue}"`);
                  }
                } else {
                  // For other fields, check exact match
                  if (actualValue !== expectedValue) {
                    console.log(`⚠️ Field value mismatch: expected "${expectedValue}", got "${actualValue}"`);
                  } else {
                    console.log(`✅ Human typed: ${element.tagName} = "${actualValue}"`);
                  }
                }
              } catch (err) {
                console.warn(`❌ Typing failed for ${element.tagName}`, err);
              }
            }

            // Human-like dropdown selection function
            async function humanSelectDropdown(element, value) {
              console.log(`🔽 Human selecting '${value}' in ${element.tagName}`);
              
              try {
                // Focus and click to open dropdown (human-like)
                element.focus();
                element.click();
                
                // Wait for dropdown to open (human-like delay)
                await new Promise(r => setTimeout(r, 150 + Math.random() * 200));
                
                const val = String(value).trim().toLowerCase();
                
                // Try exact match first
                for (let opt of element.options) {
                  if (opt.value.toLowerCase() === val || opt.text.toLowerCase() === val) {
                    // Simulate human selection with delays
                    element.focus();
                    
                    // Wait before selecting (human-like)
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
                    
                    element.value = opt.value;
                    
                    try {
                      element.dispatchEvent(new Event("change", { bubbles: true }));
                      element.dispatchEvent(new Event("input", { bubbles: true }));
                    } catch (e) {
                      console.log("🔒 Security script detected on dropdown change");
                    }
                    
                    // Wait after selection (human-like)
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
                    
                    console.log(`✅ Human selected: ${opt.text} in ${element.tagName}`);
                    return;
                  }
                }
                
                // Try partial match
                for (let opt of element.options) {
                  if (opt.value.toLowerCase().includes(val) || opt.text.toLowerCase().includes(val)) {
                    // Simulate human selection with delays
                    element.focus();
                    
                    // Wait before selecting (human-like)
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
                    
                    element.value = opt.value;
                    
                    try {
                      element.dispatchEvent(new Event("change", { bubbles: true }));
                      element.dispatchEvent(new Event("input", { bubbles: true }));
                    } catch (e) {
                      console.log("🔒 Security script detected on dropdown change");
                    }
                    
                    // Wait after selection (human-like)
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
                    
                    console.log(`✅ Human selected (partial): ${opt.text} in ${element.tagName}`);
                    return;
                  }
                }
                
                console.warn(`❌ Value '${value}' not found in ${element.tagName}. Available options:`, 
                  Array.from(element.options).map(opt => `${opt.value} (${opt.text})`));
              } catch (err) {
                console.warn(`❌ Dropdown selection failed for ${element.tagName}`, err);
              }
            }
            
            // Function to analyze current page
            async function analyzePage() {
              // Ensure visitorIndex is properly set
              if (typeof visitorIndex === 'undefined' || visitorIndex === null) {
                visitorIndex = 0; // Default to visitor 0
                console.log("⚠️ Visitor index not set, defaulting to visitor 0");
              }
              
              // Check if form filling is already completed for this specific visitor
              const visitorKey = `visitor_${visitorIndex}`;
              if (window.formFillingCompleted && window.formFillingCompleted[visitorKey]) {
                console.log(`✅ Form filling already completed for visitor ${visitorIndex + 1}, skipping...`);
                return;
              }
              
              const inputs = document.querySelectorAll('input, select, textarea');
              console.log("🔍 Found", inputs.length, "form elements on", window.location.href);
              
              if (inputs.length === 0) {
                console.log("❌ No form fields found on this page");
                return;
              }
              
              // Check if already completed recently for this visitor
              const now = Date.now();
              const lastCompletion = window.lastFormCompletion && window.lastFormCompletion[visitorKey] || 0;
              if (now - lastCompletion < 30000) { // 30 seconds
                console.log(`✅ Visitor ${visitorIndex + 1} already completed recently, skipping...`);
                return;
              }
              
              // Log all form elements
              inputs.forEach((input, index) => {
                const type = input.type || input.tagName.toLowerCase();
                const name = input.name || '';
                const id = input.id || '';
                const placeholder = input.placeholder || '';
                console.log(`${index + 1}. ${type} - name:"${name}" id:"${id}" placeholder:"${placeholder}"`);
              });
              
              // Try to fill if we find any fields
              if (inputs.length > 0) {
                console.log("✅ Found form fields, attempting to fill...");
                
                const record = data[0];
                if (!record) {
                  console.error("❌ No data available");
                  return;
                }
                
                console.log(`👤 Filling Visitor ${visitorIndex + 1} with data:`, record);
                
                // Mark completion timestamp for this specific visitor
                window.lastFormCompletion = window.lastFormCompletion || {};
                window.lastFormCompletion[`visitor_${visitorIndex}`] = Date.now();
                
                // Fill fields one by one with proper delays
                const fieldsToFill = [
                  {
                    name: 'name',
                    value: String(record.Name).toUpperCase().trim(),
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
                    value: record.Gender,
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
                    value: record.TouristType,
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
                    value: record.IDType,
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
                    value: record.IDValue,
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
                    value: record.Age,
                    selectors: [
                      `input[name="data[dataGrid1][${visitorIndex}][age]"]`,
                      `input[name*="[${visitorIndex}][age]"]`,
                      'input[name*="age" i]',
                      'input[placeholder*="age" i]',
                      'input[id*="age" i]',
                      'input[type="number"]'
                    ]
                  }
                ];
                
                // Handle photo upload if photo path exists
                if (record.PhotoPath) {
                  console.log(`📸 Auto-uploading photo: ${record.PhotoPath}`);
                  
                  // Find photo upload input
                  const photoInputs = document.querySelectorAll(`input[type="file"][name*="photo" i], input[type="file"][name*="image" i], input[type="file"][name*="photo" i], input[type="file"][accept*="image"], input[type="file"]`);
                  
                  if (photoInputs.length > 0) {
                    const photoInput = photoInputs[0];
                    console.log(`📸 Found photo input: ${photoInput.name || photoInput.id}`);
                    
                    // Create a File object from the photo path
                    fetch(record.PhotoPath)
                      .then(response => response.blob())
                      .then(blob => {
                        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
                        
                        // Create a new FileList-like object
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        photoInput.files = dataTransfer.files;
                        
                        // Trigger change event
                        photoInput.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log(`✅ Photo uploaded successfully: ${record.PhotoPath}`);
                      })
                      .catch(error => {
                        console.error(`❌ Error uploading photo: ${error.message}`);
                      });
                  } else {
                    console.log("❌ No photo upload input found");
                  }
                }
                
                // Fill each field with proper delays
                for (let field of fieldsToFill) {
                  if (!field.value) continue;
                  
                  let fieldElement = null;
                  for (let selector of field.selectors) {
                    fieldElement = document.querySelector(selector);
                    if (fieldElement) break;
                  }
                  
                  if (fieldElement) {
                    console.log(`📝 Filling ${field.name}: ${field.value}`);
                    
                    if (field.isDropdown) {
                      await humanSelectDropdown(fieldElement, field.value);
                    } else {
                      await humanType(fieldElement, field.value);
                    }
                    
                    // Ultra fast field switching - minimal delay (10-20ms)
                    await new Promise(r => setTimeout(r, 10 + Math.random() * 10));
                    
                    // Simple verification - reduced spam
                    if (fieldElement.value !== field.value && !field.isDropdown) {
                      // Only log if there's a real mismatch (not just case difference for names)
                      if (field.name && field.name.includes('name')) {
                        if (fieldElement.value.toLowerCase() !== field.value.toLowerCase()) {
                          console.log(`⚠️ Name field case mismatch: expected "${field.value}", got "${fieldElement.value}"`);
                        }
                      } else {
                        console.log(`⚠️ Field ${field.name} value mismatch: expected "${field.value}", got "${fieldElement.value}"`);
                      }
                    }
                  }
                }
                
                console.log("✅ Manual fill completed!");
                
                // Disable dynamic form detection to prevent re-filling
                window.formFillingCompleted = window.formFillingCompleted || {};
                window.formFillingCompleted[`visitor_${visitorIndex}`] = true;
                
                // Disable MutationObserver if it exists
                if (window.formObserver) {
                  window.formObserver.disconnect();
                  console.log("🔒 Dynamic form detection disabled");
                }
                
                // Also disable any other observers
                if (window.observers) {
                  window.observers.forEach(observer => observer.disconnect());
                  console.log("🔒 All observers disabled");
                }
                
                // Show success banner
                const banner = document.createElement('div');
                banner.innerHTML = `✅ Visitor ${visitorIndex + 1} filled successfully!`;
                banner.style.cssText = 'position: fixed; top: 10px; right: 10px; background: green; color: white; padding: 10px; border-radius: 5px; z-index: 99999;';
                document.body.appendChild(banner);
                setTimeout(() => banner.remove(), 3000);
              }
            }
            
            // Start the analysis
            analyzePage();
            
            // DISABLED: MutationObserver causing infinite spam
            /*
            // Set up mutation observer for dynamic form fields
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                  const newInputs = document.querySelectorAll('input, select, textarea');
                  if (newInputs.length > 0) {
                    console.log("🎯 New form fields detected dynamically!");
                    analyzePage();
                  }
                }
              });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Stop observing after 30 seconds
            setTimeout(() => {
              observer.disconnect();
              console.log("⏰ Dynamic field detection stopped");
            }, 30000);
            */
            
          },
          args: [selectedData, visitorIndex]
        });
      });
    });
  });
  
  function updateStatus(message, type) {
    const el = document.getElementById('status');
    el.innerText = message;
    el.className = type;
  }