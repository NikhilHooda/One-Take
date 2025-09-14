const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Storyboard generation endpoint
app.post('/api/generate-storyboard', async (req, res) => {
  try {
    const { githubUrl, websiteUrl, specifications } = req.body;

    // Validate required fields
    if (!githubUrl) {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }

    // Validate GitHub URL
    try {
      const url = new URL(githubUrl);
      if (url.hostname !== 'github.com') {
        return res.status(400).json({ error: 'Invalid GitHub URL' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate unique IDs for this request
    const requestId = Date.now().toString();
    const storyboardPath = path.join(__dirname, 'storyboards', `${requestId}.storyboard.json`);
    const transcriptPath = path.join(__dirname, 'storyboards', `${requestId}.transcript.txt`);
    const siteSummaryPath = path.join(__dirname, 'site_dumps', `${requestId}.site.json`);

    // Determine the URL to analyze (prefer website URL if provided)
    const targetUrl = websiteUrl || githubUrl;
    console.log(`Starting storyboard generation for: ${githubUrl}`);

    // First, scan the website to get site summary
    const scanArgs = [
      '-m', 'storyboardpy', 'scan',
      '--url', targetUrl,
      '--max-pages', '5',
      '--artifacts-dir', path.join(__dirname, 'artifacts', requestId),
      '--site-out', siteSummaryPath
    ];

    console.log('Running scan command:', 'python', scanArgs.join(' '));

    // Run the scan command
    const scanResult = await new Promise((resolve, reject) => {
      const scanProcess = spawn('python', scanArgs, {
        cwd: path.join(__dirname, '..', 'storyboard-creation'),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      scanProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      scanProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      scanProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Scan process exited with code ${code}: ${stderr}`));
        }
      });

      scanProcess.on('error', (error) => {
        reject(new Error(`Failed to start scan process: ${error.message}`));
      });
    });

    console.log('Scan completed successfully');

    // Now generate the storyboard from the site summary
    const storyboardArgs = [
      '-m', 'storyboardpy', 'storyboard',
      '--site-in', siteSummaryPath,
      '--duration-hint', '90',
      '--out', storyboardPath,
      '--transcript-out', transcriptPath
    ];

    // Add specifications as goal if provided
    if (specifications && specifications.trim()) {
      storyboardArgs.push('--goal', specifications.trim());
    }

    console.log('Running storyboard command:', 'python', storyboardArgs.join(' '));

    // Run the storyboard generation command
    const storyboardResult = await new Promise((resolve, reject) => {
      const storyboardProcess = spawn('python', storyboardArgs, {
        cwd: path.join(__dirname, '..', 'storyboard-creation'),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      storyboardProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      storyboardProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      storyboardProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Storyboard process exited with code ${code}: ${stderr}`));
        }
      });

      storyboardProcess.on('error', (error) => {
        reject(new Error(`Failed to start storyboard process: ${error.message}`));
      });
    });

    console.log('Storyboard generation completed successfully');

    // Read the generated files
    const storyboardData = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
    const transcript = fs.readFileSync(transcriptPath, 'utf8');

    // Clean up temporary files
    try {
      fs.unlinkSync(storyboardPath);
      fs.unlinkSync(transcriptPath);
      fs.unlinkSync(siteSummaryPath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary files:', cleanupError.message);
    }

    // Return the response
    res.json({
      success: true,
      storyboard: storyboardData,
      transcript: transcript,
      requestId: requestId,
      generatedAt: new Date().toISOString(),
      sourceUrls: {
        githubUrl: githubUrl,
        websiteUrl: websiteUrl
      }
    });

  } catch (error) {
    console.error('Error generating storyboard:', error);
    res.status(500).json({ 
      error: 'Failed to generate storyboard', 
      details: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});