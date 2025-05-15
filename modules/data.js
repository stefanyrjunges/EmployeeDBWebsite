const axios = require('axios');

async function fetchData() {
  
  let employeeData = [];

  try {
    //Fetching data from JSONplaceholder
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=1');
    
    //Transforming the data into another JSON structure
    employeeData = response.data.map((post) => ({
      id: post.id,    
      firstName: post.title,      
      lastName: post.body,
      //Setting unknown and 0 as placeholders 
      role: 'Unknown',
      salary: 0                  
    }));

  } catch (error) {
    console.error('Error fetching data:', error.message);
    //Resetting
    employeeData = [];
  }

  return employeeData;

}

//Exporting the function
module.exports = fetchData;