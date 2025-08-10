const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open the database
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Database Contents Viewer');
console.log('============================\n');

// Function to display table contents
function showTable(tableName) {
  return new Promise((resolve, reject) => {
    console.log(`📋 Table: ${tableName}`);
    console.log('-'.repeat(50));
    
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        console.error(`Error reading ${tableName}:`, err.message);
        resolve();
        return;
      }
      
      if (rows.length === 0) {
        console.log('No data found');
      } else {
        console.table(rows);
      }
      console.log('\n');
      resolve();
    });
  });
}

// Show all tables and their contents
async function viewDatabase() {
  try {
    // Get list of tables
    db.all("SELECT name FROM sqlite_master WHERE type='table'", async (err, tables) => {
      if (err) {
        console.error('Error getting tables:', err.message);
        return;
      }
      
      console.log(`Found ${tables.length} tables:\n`);
      
      // Display each table
      for (const table of tables) {
        await showTable(table.name);
      }
      
      // Close database
      db.close();
      console.log('✅ Database viewer completed');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    db.close();
  }
}

// Run the viewer
viewDatabase();
