// New Users Data for Testing Uppercase Name Functionality
// Copy this data and use it for testing the extension

const newUsersData = [
  {
    Name: "RAHUL KUMAR",
    Gender: "Male",
    TouristType: "Indian",
    IDType: "Aadhar",
    IDValue: "123456789012",
    Age: "25",
    PhotoPath: "photos/rahul.jpg"
  },
  {
    Name: "PRIYA SHARMA",
    Gender: "Female",
    TouristType: "Indian",
    IDType: "PAN",
    IDValue: "ABCDE1234F",
    Age: "28",
    PhotoPath: "photos/priya.jpg"
  },
  {
    Name: "AMIT SINGH",
    Gender: "Male",
    TouristType: "Foreigner",
    IDType: "Passport",
    IDValue: "A1234567",
    Age: "32",
    PhotoPath: "photos/amit.jpg"
  },
  {
    Name: "SUNITA VERMA",
    Gender: "Female",
    TouristType: "Indian",
    IDType: "Aadhar",
    IDValue: "987654321098",
    Age: "45",
    PhotoPath: "photos/sunita.jpg"
  },
  {
    Name: "RAJESH PATEL",
    Gender: "Male",
    TouristType: "Indian",
    IDType: "Aadhar",
    IDValue: "111122223333",
    Age: "35",
    PhotoPath: "photos/rajesh.jpg"
  },
  {
    Name: "NEHA GUPTA",
    Gender: "Female",
    TouristType: "Foreigner",
    IDType: "Passport",
    IDValue: "B9876543",
    Age: "29",
    PhotoPath: "photos/neha.jpg"
  },
  {
    Name: "VIKAS MALHOTRA",
    Gender: "Male",
    TouristType: "Indian",
    IDType: "PAN",
    IDValue: "XYZAB5678C",
    Age: "41",
    PhotoPath: "photos/vikas.jpg"
  },
  {
    Name: "ANJALI DESAI",
    Gender: "Female",
    TouristType: "Indian",
    IDType: "Aadhar",
    IDValue: "444455556666",
    Age: "27",
    PhotoPath: "photos/anjali.jpg"
  },
  {
    Name: "SURESH KUMAR",
    Gender: "Male",
    TouristType: "Foreigner",
    IDType: "Passport",
    IDValue: "C5555666",
    Age: "38",
    PhotoPath: "photos/suresh.jpg"
  },
  {
    Name: "MEERA REDDY",
    Gender: "Female",
    TouristType: "Indian",
    IDType: "Aadhar",
    IDValue: "777788889999",
    Age: "33",
    PhotoPath: "photos/meera.jpg"
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = newUsersData;
}

// For browser use
if (typeof window !== 'undefined') {
  window.newUsersData = newUsersData;
}

console.log("✅ New Users Data loaded successfully!");
console.log("📊 Total users:", newUsersData.length);
console.log("🔤 All names are in UPPERCASE for case-sensitive systems");
