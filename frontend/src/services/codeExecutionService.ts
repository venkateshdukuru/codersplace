// src/services/codeExecutionService.ts

import axios from 'axios';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'your-rapidapi-key';

// Judge0 Language IDs
export const LANGUAGE_IDS = {
  63: 'JavaScript (Node.js 12.14.0)',
  71: 'Python (3.8.1)',
  62: 'Java (OpenJDK 13.0.1)',
  54: 'C++ (GCC 9.2.0)',
  50: 'C (GCC 9.2.0)',
  51: 'C# (Mono 6.6.0.161)',
  74: 'TypeScript (3.7.4)',
  60: 'Go (1.13.5)',
  73: 'Rust (1.40.0)',
  72: 'Ruby (2.7.0)',
  68: 'PHP (7.4.1)',
};

interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

class CodeExecutionService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = RAPIDAPI_KEY;
    this.apiUrl = JUDGE0_API_URL;
  }

  /**
   * Submit code for execution
   */
  async executeCode(
    code: string,
    languageId: number,
    input?: string
  ): Promise<ExecutionResult> {
    try {
      // Create submission
      const submissionResponse = await axios.post(
        `${this.apiUrl}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageId,
          stdin: input || '',
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      const token = submissionResponse.data.token;

      // Get submission result
      const resultResponse = await axios.get(
        `${this.apiUrl}/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      return resultResponse.data;
    } catch (error: any) {
      console.error('Code execution error:', error);
      throw new Error(error.response?.data?.message || 'Code execution failed');
    }
  }

  /**
   * Run code against multiple test cases
   */
  async runTestCases(
    code: string,
    languageId: number,
    testCases: Array<{ input: string; output: string }>
  ): Promise<{
    passed: number;
    failed: number;
    total: number;
    results: Array<{
      testCase: number;
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput: string;
      error?: string;
      time?: string;
      memory?: number;
    }>;
  }> {
    const results = [];
    let passed = 0;
    let failed = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const result = await this.executeCode(code, languageId, testCase.input);
        
        const actualOutput = (result.stdout || '').trim();
        const expectedOutput = testCase.output.trim();
        const isPassed = actualOutput === expectedOutput && result.status.id === 3;

        if (isPassed) {
          passed++;
        } else {
          failed++;
        }

        results.push({
          testCase: i + 1,
          passed: isPassed,
          input: testCase.input,
          expectedOutput: expectedOutput,
          actualOutput: actualOutput,
          error: result.stderr || result.compile_output || result.message || undefined,
          time: result.time,
          memory: result.memory,
        });
      } catch (error: any) {
        failed++;
        results.push({
          testCase: i + 1,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: '',
          error: error.message,
        });
      }
    }

    return {
      passed,
      failed,
      total: testCases.length,
      results,
    };
  }

  /**
   * Format execution result for display
   */
  formatOutput(result: ExecutionResult): string {
    const { status, stdout, stderr, compile_output, message, time, memory } = result;

    let output = '';

    // Status
    output += `Status: ${status.description}\n`;
    output += `Time: ${time}s | Memory: ${memory} KB\n\n`;

    // Output
    if (stdout) {
      output += '📤 Output:\n';
      output += stdout + '\n\n';
    }

    // Errors
    if (stderr) {
      output += '❌ Runtime Error:\n';
      output += stderr + '\n\n';
    }

    if (compile_output) {
      output += '⚠️ Compilation Error:\n';
      output += compile_output + '\n\n';
    }

    if (message && status.id !== 3) {
      output += '⚠️ Message:\n';
      output += message + '\n';
    }

    return output || 'No output';
  }
}

export const codeExecutionService = new CodeExecutionService();