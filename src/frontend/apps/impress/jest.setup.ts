import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import * as dotenv from 'dotenv';

expect.extend(toHaveNoViolations);

dotenv.config({ path: './.env.test' });
