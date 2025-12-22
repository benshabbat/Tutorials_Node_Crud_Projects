// 🚀 Simple server with Express and File System
// Practical example for working with files

import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// 📄 Homepage - Server explanation
app.get('/', (req, res) => {
  res.send(`
    <h1>🎉 Node.js Server with File System</h1>
    <h2>Available Routes:</h2>
    <ul>
      <li><a href="/read">📖 Read file - GET /read</a></li>
      <li>✍️ Write to file - POST /write (send JSON with "content")</li>
      <li><a href="/list">📂 List files - GET /list</a></li>
      <li>🗑️ Delete file - DELETE /delete/:filename</li>
    </ul>
    <h3>How to get started?</h3>
    <ol>
      <li>Click "Read file" to create a file automatically</li>
      <li>Send POST to /write to write new content</li>
      <li>See all files at /list</li>
    </ol>
  `);
});

// 📖 Read file
app.get('/read', async (req, res) => {
  try {
    // Try to read the file
    const content = await fs.readFile('example.txt', 'utf-8');
    res.json({
      success: true,
      message: 'File read successfully',
      content: content,
      timestamp: new Date().toLocaleString('en-US')
    });
  } catch (error) {
    // If file doesn't exist, create it
    if (error.code === 'ENOENT') {
      const initialContent = 'Welcome! This is your example file.\nCreated at ' + new Date().toLocaleString('en-US');
      await fs.writeFile('example.txt', initialContent);
      res.json({
        success: true,
        message: 'New file created!',
        content: initialContent
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error reading file',
        error: error.message
      });
    }
  }
});

// ✍️ Write to file
app.post('/write', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }
    
    const fullContent = `${content}\n[Written at ${new Date().toLocaleString('en-US')}]`;
    await fs.writeFile('example.txt', fullContent);
    
    res.json({
      success: true,
      message: 'Content written successfully!',
      content: fullContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error writing file',
      error: error.message
    });
  }
});

// 📝 Append to existing file
app.post('/append', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required for appending'
      });
    }
    
    const appendContent = `\n${content} [${new Date().toLocaleString('en-US')}]`;
    await fs.appendFile('example.txt', appendContent);
    
    res.json({
      success: true,
      message: 'Content appended successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error appending content',
      error: error.message
    });
  }
});

// 📂 List all files in directory
app.get('/list', async (req, res) => {
  try {
    const files = await fs.readdir('.');
    
    // Filter only text and JSON files
    const filteredFiles = files.filter(file => 
      file.endsWith('.txt') || 
      file.endsWith('.json') || 
      file.endsWith('.md')
    );
    
    // Get detailed info for each file
    const filesWithInfo = await Promise.all(
      filteredFiles.map(async (file) => {
        const stats = await fs.stat(file);
        return {
          name: file,
          size: `${stats.size} bytes`,
          modified: stats.mtime.toLocaleString('en-US'),
          isFile: stats.isFile()
        };
      })
    );
    
    res.json({
      success: true,
      count: filesWithInfo.length,
      files: filesWithInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reading files',
      error: error.message
    });
  }
});

// 🗑️ Delete file
app.delete('/delete/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Safety: Make sure we don't delete important files
    const protectedFiles = ['server.js', 'package.json', 'simple-fs-server.js'];
    if (protectedFiles.includes(filename)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete this file'
      });
    }
    
    await fs.unlink(filename);
    
    res.json({
      success: true,
      message: `File ${filename} deleted successfully`
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error deleting file',
        error: error.message
      });
    }
  }
});

// 📊 Information about specific file
app.get('/info/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const stats = await fs.stat(filename);
    
    res.json({
      success: true,
      info: {
        name: filename,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        created: stats.birthtime.toLocaleString('en-US'),
        modified: stats.mtime.toLocaleString('en-US'),
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n🎉 Server started successfully!');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('\n📚 Available routes:');
  console.log('   GET    /           - Homepage');
  console.log('   GET    /read       - Read file');
  console.log('   POST   /write      - Write file');
  console.log('   POST   /append     - Append to file');
  console.log('   GET    /list       - List files');
  console.log('   DELETE /delete/:id - Delete file');
  console.log('   GET    /info/:id   - File information');
  console.log('\n💡 Tip: Open browser and go to http://localhost:3000');
  console.log('');
});
