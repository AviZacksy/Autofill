// Fix Age Field Validation Script
// Run this in browser console to fix age field validation

(function() {
  console.log("🔧 Fixing age field validation...");
  
  // Find all age fields
  const ageFields = document.querySelectorAll('input[name*="age"], input[placeholder*="age"], input[id*="age"]');
  
  ageFields.forEach((field, index) => {
    console.log(`📝 Found age field ${index + 1}:`, field.name || field.id);
    
    // Ensure proper type and validation
    field.type = 'number';
    field.min = '1';
    field.max = '120';
    field.step = '1';
    
    // Add proper event listeners
    field.addEventListener('input', function(e) {
      const value = parseInt(this.value);
      if (value < 1 || value > 120) {
        this.setCustomValidity('Age must be between 1 and 120');
      } else {
        this.setCustomValidity('');
      }
    });
    
    // Ensure the field is properly functional
    field.disabled = false;
    field.readOnly = false;
    field.style.pointerEvents = 'auto';
    field.style.userSelect = 'auto';
    
    console.log(`✅ Fixed age field ${index + 1}`);
  });
  
  console.log(`✅ Fixed ${ageFields.length} age fields`);
  
  // Create info panel
  const infoPanel = document.createElement('div');
  infoPanel.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,255,0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-width: 300px;
    ">
      <h4>🔧 Age Fields Fixed</h4>
      <p>✅ Fixed ${ageFields.length} age fields</p>
      <p>✅ Proper validation added</p>
      <p>✅ Type set to number</p>
      <p>✅ Range: 1-120 years</p>
      <button onclick="this.parentElement.remove()" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(infoPanel);
  
})();
