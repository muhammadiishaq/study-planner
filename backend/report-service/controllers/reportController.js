const DailyReport = require('../models/DailyReport');
const pdfParse = require('pdf-parse');
const fs = require('fs');

exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    console.log('📄 Extracted text (first 2000 chars):', extractedText.substring(0, 2000));
    console.log('📄 Total text length:', extractedText.length, 'characters');

    const diplomaProgress = extractDiplomaProgress(extractedText);
    const reportDate = extractReportDate(extractedText);

    const report = await DailyReport.create({
      userId,
      reportDate,
      diplomaProgress,
      extractedText: extractedText.substring(0, 2000)
    });

    fs.unlinkSync(req.file.path);
    console.log('🗑️  PDF file deleted after extraction');

    res.status(201).json({
      success: true,
      message: 'Report processed successfully',
      data: {
        reportId: report._id,
        reportDate: report.reportDate,
        diplomaProgress: Object.fromEntries(report.diplomaProgress)
      }
    });

  } catch (error) {
    console.error('Upload report error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error processing report',
      error: error.message
    });
  }
};

exports.getReportHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 30 } = req.query;

    const reports = await DailyReport.find({ userId })
      .sort({ reportDate: -1 })
      .limit(parseInt(limit))
      .select('-extractedText');

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports.map(report => ({
        reportId: report._id,
        reportDate: report.reportDate,
        diplomaProgress: Object.fromEntries(report.diplomaProgress),
        uploadedAt: report.uploadedAt
      }))
    });

  } catch (error) {
    console.error('Get report history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report history',
      error: error.message
    });
  }
};

exports.getLatestReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const report = await DailyReport.findOne({ userId })
      .sort({ reportDate: -1 })
      .select('-extractedText');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'No reports found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        reportId: report._id,
        reportDate: report.reportDate,
        diplomaProgress: Object.fromEntries(report.diplomaProgress),
        uploadedAt: report.uploadedAt
      }
    });

  } catch (error) {
    console.error('Get latest report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest report',
      error: error.message
    });
  }
};

// ==================== FINAL PERFECT EXTRACTION ====================

function extractDiplomaProgress(text) {
  const progressMap = new Map();

  console.log('🔍 Starting FINAL PERFECT extraction...');

  // STRATEGY: Find exact diploma line and get the number IMMEDIATELY after it
  const diplomas = [
    { name: 'Diploma in Cloud Cyber Security', shortName: 'Cyber Security' },
    { name: 'Diploma in Artificial Intelligence Advancement', shortName: 'AI' },
    { name: 'Diploma in DevOps and Cloud Advancement', shortName: 'DevOps' },
    { name: 'Diploma in SysOps and Cloud Advancement', shortName: 'SysOps' },
    { name: 'Diploma in AIOPS ( Exam L6)', shortName: 'AIOps' }
  ];

  diplomas.forEach(({ name, shortName }) => {
    // Find the exact line with diploma name
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line contains the diploma name
      if (line.toLowerCase().includes(name.toLowerCase())) {
        console.log(`🔍 Found line for ${shortName}: "${line}"`);
        
        // Strategy 1: Number is on the SAME line
        // Match: "Diploma in SysOps and Cloud Advancement85.0" or "Diploma in SysOps and Cloud Advancement 85.0"
        const sameLine = line.match(/(\d+\.?\d*)\s*$/);
        if (sameLine) {
          const value = parseFloat(sameLine[1]);
          if (value >= 0 && value <= 100) {
            progressMap.set(shortName, value);
            console.log(`✅ Found ${shortName} = ${value}% (same line)`);
            return; // Found it, stop searching for this diploma
          }
        }

        // Strategy 2: Number is on the NEXT line
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const nextLineMatch = nextLine.match(/^(\d+\.?\d*)/);
          if (nextLineMatch) {
            const value = parseFloat(nextLineMatch[1]);
            if (value >= 0 && value <= 100) {
              progressMap.set(shortName, value);
              console.log(`✅ Found ${shortName} = ${value}% (next line)`);
              return;
            }
          }
        }

        // Strategy 3: Get everything after the diploma name on same line
        const afterName = line.substring(line.toLowerCase().indexOf(name.toLowerCase()) + name.length);
        const numberAfter = afterName.match(/(\d+\.?\d*)/);
        if (numberAfter) {
          const value = parseFloat(numberAfter[1]);
          if (value >= 0 && value <= 100) {
            progressMap.set(shortName, value);
            console.log(`✅ Found ${shortName} = ${value}% (after name)`);
            return;
          }
        }
      }
    }

    console.log(`❌ Could not find ${shortName}`);
  });

  console.log('📊 FINAL RESULTS:');
  if (progressMap.size > 0) {
    for (const [diploma, progress] of progressMap.entries()) {
      console.log(`   ✅ ${diploma}: ${progress}%`);
    }
  } else {
    console.log('   ⚠️ No diplomas extracted!');
  }

  return progressMap;
}

function extractReportDate(text) {
  const patterns = [
    /(\d{4})-(\d{2})-(\d{2})/,
    /(\d{2})\/(\d{2})\/(\d{4})/,
    /(\d{2})-(\d{2})-(\d{4})/,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        return new Date(match[0]);
      } catch (e) {
        continue;
      }
    }
  }

  return new Date();
}

module.exports = exports;