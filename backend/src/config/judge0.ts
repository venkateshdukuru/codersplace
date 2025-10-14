import axios from 'axios';
import { config } from './env';

const judge0 = axios.create({
  baseURL: `${config.JUDGE0_URL}/submissions`,
  headers: {
    'X-RapidAPI-Key': config.JUDGE0_KEY,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
});

export const submitBatch = async (submissions: any[]) => {
  const res = await judge0.post('/batch', { submissions });
  return res.data;
};

export const getBatchResults = async (tokens: string[]) => {
  const res = await judge0.get(`/batch?tokens=${tokens.join(',')}&base64_encoded=true`);
  return res.data.submissions;
};

// Poll until all done
export const pollResults = async (tokens: string[]) => {
  let results;
  do {
    results = await getBatchResults(tokens);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every 1s
  } while (results.some((r: any) => r.status.id <= 2)); // In queue or processing
  return results;
};