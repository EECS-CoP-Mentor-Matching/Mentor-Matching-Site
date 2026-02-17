/**
 * TEST MATCHING ALGORITHM COMPONENT
 * 
 * UI for testing the weighted matching algorithm
 */

import React, { useState } from 'react';
import testMatchingService from '../../../dal/__tests__/testMatchingService';

const TestMatchingComponent: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addOutput = (message: string) => {
    setOutput(prev => [...prev, message]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  // Capture console.log to display in UI
  const captureConsole = (fn: () => any | Promise<any>) => {
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addOutput(message);
      originalLog(...args);
    };
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        console.log = originalLog;
      });
    } else {
      console.log = originalLog;
      return result;
    }
  };

  const handleQuickTest = async () => {
    setLoading(true);
    clearOutput();
    
    try {
      await captureConsole(() => testMatchingService.quickMatchingTest());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAllTests = async () => {
    setLoading(true);
    clearOutput();
    
    try {
      await captureConsole(() => testMatchingService.runAllMatchingTests());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateScore = () => {
    setLoading(true);
    clearOutput();
    
    try {
      captureConsole(() => testMatchingService.testCalculateMatchScore());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFindMatches = async () => {
    setLoading(true);
    clearOutput();
    
    try {
      await captureConsole(() => testMatchingService.testFindMentorMatches());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightTest = () => {
    setLoading(true);
    clearOutput();
    
    try {
      captureConsole(() => testMatchingService.testWeightCombinations());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePerfectMatch = () => {
    setLoading(true);
    clearOutput();
    
    try {
      captureConsole(() => testMatchingService.testPerfectMatch());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePoorMatch = () => {
    setLoading(true);
    clearOutput();
    
    try {
      captureConsole(() => testMatchingService.testPoorMatch());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAllCombinations = async () => {
    setLoading(true);
    clearOutput();
    
    try {
      await captureConsole(() => testMatchingService.testAllCombinations());
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Matching Algorithm Test Suite</h1>
      
      <div style={styles.description}>
        <p>Test the weighted matching algorithm with sample mentee and mentor profiles.</p>
        <p><strong>What it tests:</strong> Match percentage calculations, weight effects, and finding potential matches.</p>
      </div>

      <div style={styles.buttonGrid}>
        <button 
          onClick={handleQuickTest} 
          disabled={loading}
          style={{...styles.button, ...styles.primaryButton}}
        >
          ⚡ Quick Test
        </button>

        <button 
          onClick={handleRunAllTests} 
          disabled={loading}
          style={{...styles.button, ...styles.primaryButton}}
        >
          🚀 Run All Tests
        </button>

        <button 
          onClick={handleCalculateScore} 
          disabled={loading}
          style={styles.button}
        >
          🧮 Calculate Score
        </button>

        <button 
          onClick={handleFindMatches} 
          disabled={loading}
          style={styles.button}
        >
          🔍 Find Matches
        </button>

        <button 
          onClick={handleWeightTest} 
          disabled={loading}
          style={styles.button}
        >
          ⚖️ Weight Effects
        </button>

        <button 
          onClick={handlePerfectMatch} 
          disabled={loading}
          style={styles.button}
        >
          💯 Perfect Match
        </button>

        <button 
          onClick={handlePoorMatch} 
          disabled={loading}
          style={styles.button}
        >
          ❌ Poor Match
        </button>

        <button 
          onClick={handleAllCombinations} 
          disabled={loading}
          style={styles.button}
        >
          📊 All Combinations
        </button>

        <button 
          onClick={clearOutput} 
          disabled={loading}
          style={{...styles.button, ...styles.clearButton}}
        >
          🗑️ Clear Output
        </button>
      </div>

      <div style={styles.outputContainer}>
        <h3>Output:</h3>
        <div style={styles.output}>
          {output.length === 0 ? (
            <div style={styles.placeholder}>Click a button to run tests...</div>
          ) : (
            output.map((line, index) => (
              <div key={index} style={styles.outputLine}>{line}</div>
            ))
          )}
        </div>
      </div>

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}>⏳ Running test...</div>
        </div>
      )}

      <div style={styles.legend}>
        <h3>Test Descriptions:</h3>
        <ul>
          <li><strong>Quick Test:</strong> Basic match calculation + find matches</li>
          <li><strong>Run All Tests:</strong> Complete test suite (all 6 tests)</li>
          <li><strong>Calculate Score:</strong> Match one mentee with one mentor</li>
          <li><strong>Find Matches:</strong> Find all mentors for a mentee</li>
          <li><strong>Weight Effects:</strong> See how weights change match %</li>
          <li><strong>Perfect Match:</strong> Test profile against itself (~100%)</li>
          <li><strong>Poor Match:</strong> Test very different profiles</li>
          <li><strong>All Combinations:</strong> Matrix of all mentees vs all mentors</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    color: '#333',
    borderBottom: '3px solid #0066cc',
    paddingBottom: '10px'
  },
  description: {
    background: '#f0f8ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #0066cc'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '10px',
    marginBottom: '30px'
  },
  button: {
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid #ddd',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  primaryButton: {
    background: '#0066cc',
    color: 'white',
    border: '2px solid #0066cc'
  } as React.CSSProperties,
  clearButton: {
    background: '#ff6b6b',
    color: 'white',
    border: '2px solid #ff6b6b'
  } as React.CSSProperties,
  outputContainer: {
    marginBottom: '30px'
  },
  output: {
    background: '#1e1e1e',
    color: '#d4d4d4',
    padding: '15px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '13px',
    minHeight: '300px',
    maxHeight: '500px',
    overflowY: 'auto' as const,
    whiteSpace: 'pre-wrap' as const
  },
  outputLine: {
    marginBottom: '5px',
    lineHeight: '1.5'
  },
  placeholder: {
    color: '#888',
    fontStyle: 'italic'
  },
  loadingOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  spinner: {
    background: 'white',
    padding: '30px 50px',
    borderRadius: '10px',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  legend: {
    background: '#fff3cd',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ffc107'
  }
};

export default TestMatchingComponent;
