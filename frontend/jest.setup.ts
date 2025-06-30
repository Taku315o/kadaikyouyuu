// jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfill for Next.js Web API in Jest environment
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
