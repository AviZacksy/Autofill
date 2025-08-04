// Debug script to help identify form fields
// Run this in the browser console to see all form fields

(function() {
  console.log("🔍 DEBUG: Analyzing form fields on this page...");
  
  // Find all input fields
  const inputs = document.querySelectorAll('input, select, textarea');
  console.log(`📝 Found ${inputs.length} form fields:`);
  
  inputs.forEach((input, index) => {
    const type = input.type || input.tagName.toLowerCase();
    const name = input.name || 'no-name';
    const id = input.id || 'no-id';
    const placeholder = input.placeholder || 'no-placeholder';
    const value = input.value || 'no-value';
    
    console.log(`${index + 1}. ${type} - name:"${name}" id:"${id}" placeholder:"${placeholder}" value:"${value}"`);
    
    // Highlight the element
    input.style.border = '2px solid red';
    input.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    
    setTimeout(() => {
      input.style.border = '';
      input.style.backgroundColor = '';
    }, 2000);
  });
  
  // Find iframes
  const iframes = document.querySelectorAll('iframe');
  console.log(`🖼️ Found ${iframes.length} iframes:`);
  
  iframes.forEach((iframe, index) => {
    console.log(`${index + 1}. iframe src: ${iframe.src}`);
    console.log(`   iframe id: ${iframe.id}`);
    console.log(`   iframe name: ${iframe.name}`);
  });
  
  // Create a floating debug panel
  const debugPanel = document.createElement('div');
  debugPanel.innerHTML = `
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
      <h4>🔍 Form Debug Info</h4>
      <p>Inputs: ${inputs.length}</p>
      <p>Iframes: ${iframes.length}</p>
      <p>URL: ${window.location.href}</p>
      <button onclick="this.parentElement.remove()" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(debugPanel);
  
  console.log("✅ Debug analysis complete! Check the floating panel for summary.");
})(); 