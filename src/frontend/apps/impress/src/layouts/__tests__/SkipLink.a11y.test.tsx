import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { MAIN_LAYOUT_ID } from '../conf';

const SkipLinkExample = () => (
  <>
    <a href={`#${MAIN_LAYOUT_ID}`} className="skip-link">
      Skip to main content
    </a>
    <main id={MAIN_LAYOUT_ID}>content</main>
  </>
);

describe('Skip link', () => {
  it('is accessible', async () => {
    const { container } = render(<SkipLinkExample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
