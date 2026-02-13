/**
 * MATCH DATABASE TEST COMPONENT
 * 
 * A simple UI to test the matchDb functionality
 * 
 * HOW TO USE:
 * 1. Import this component into your app
 * 2. Add it to a route (e.g., /test-match-db)
 * 3. Click buttons to run tests
 * 4. Watch the console and check Firestore
 */

import React, { useState } from 'react';
import testMatchDb from '../../../dal/__tests__/testMatchDb';

const TestMatchDbComponent: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastMatchId, setLastMatchId] = useState<string>('');

  const addOutput = (message: string) => {
    setOutput(prev => [...prev, message]);
    console.log(message);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const handleRunAllTests = async () => {
    setLoading(true);
    clearOutput();
    
    try {
      addOutput('🚀 Starting all tests...');
      const matchId = await testMatchDb.runAllMatchDbTests();
      setLastMatchId(matchId);
      addOutput('✅ All tests completed!');
      addOutput(`Last match ID: ${matchId}`);
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async () => {
    setLoading(true);
    clearOutput();
    
    try {
      addOutput('⚡ Running quick test...');
      const matchId = await testMatchDb.quickTest();
      setLastMatchId(matchId);
      addOutput('✅ Quick test completed!');
      addOutput(`Match ID: ${matchId}`);
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async () => {
    setLoading(true);
    clearOutput();
    
    try {
      addOutput('Creating a test match...');
      const matchId = await testMatchDb.testCreateMatch();
      setLastMatchId(matchId);
      addOutput(`✅ Match created: ${matchId}`);
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMatch = async () => {
    if (!lastMatchId) {
      addOutput('⚠️  Create a match first!');
      return;
    }
    
    setLoading(true);
    
    try {
      addOutput(`Getting match ${lastMatchId}...`);
      const match = await testMatchDb.testGetMatchById(lastMatchId);
      if (match) {
        addOutput(`✅ Found match with ${match.matchPercentage}% compatibility`);
        addOutput(`Status: ${match.status}`);
      } else {
        addOutput('⚠️  Match not found');
      }
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserMatches = async () => {
    setLoading(true);
    
    try {
      const userId = 'test-mentee-uid-123';
      addOutput(`Getting matches for user ${userId}...`);
      const matches = await testMatchDb.testGetUserMatches(userId);
      addOutput(`✅ Found ${matches.length} matches`);
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!lastMatchId) {
      addOutput('⚠️  Create a match first!');
      return;
    }
    
    setLoading(true);
    
    try {
      addOutput(`Updating match ${lastMatchId} to "accepted"...`);
      await testMatchDb.testUpdateMatchStatus(lastMatchId, 'accepted');
      addOutput('✅ Status updated successfully');
    } catch (error: any) {
      addOutput(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Match Database Test Suite</h1>
      
      <div style={styles.description}>
        <p>This page tests the matchDb functionality. Open your browser console and Firestore console to see the results.</p>
        <p><strong>Firestore:</strong> Check the "matches" collection after running tests.</p>
      </div>

      {lastMatchId && (
        <div style={styles.infoBox}>
          <strong>Last Match ID:</strong> <code>{lastMatchId}</code>
        </div>
      )}

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
          onClick={handleCreateMatch} 
          disabled={loading}
          style={styles.button}
        >
          ➕ Create Match
        </button>

        <button 
          onClick={handleGetMatch} 
          disabled={loading || !lastMatchId}
          style={styles.button}
        >
          🔍 Get Match by ID
        </button>

        <button 
          onClick={handleGetUserMatches} 
          disabled={loading}
          style={styles.button}
        >
          👤 Get User Matches
        </button>

        <button 
          onClick={handleUpdateStatus} 
          disabled={loading || !lastMatchId}
          style={styles.button}
        >
          ✏️ Update Status
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

      <div style={styles.instructions}>
        <h3>Manual Cleanup:</h3>
        <ol>
          <li>Go to Firebase Console → Firestore Database</li>
          <li>Find the "matches" collection</li>
          <li>Delete test documents (they have "test-" in the IDs)</li>
        </ol>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
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
  infoBox: {
    background: '#e6f7e6',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #4caf50',
    fontFamily: 'monospace'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '30px'
  },
  button: {
    padding: '12px 20px',
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
    minHeight: '200px',
    maxHeight: '400px',
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
  instructions: {
    background: '#fff3cd',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ffc107'
  }
};

export default TestMatchDbComponent;
