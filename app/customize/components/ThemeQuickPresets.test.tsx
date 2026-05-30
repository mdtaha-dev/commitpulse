import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeQuickPresets } from './ThemeQuickPresets';
import { THEME_KEYS } from '../types';

const validKeys = THEME_KEYS.filter((k) => k !== 'auto' && k !== 'random');

describe('ThemeQuickPresets', () => {
  const onThemeChange = vi.fn();

  beforeEach(() => {
    onThemeChange.mockClear();
  });

  it('renders without crashing', () => {
    render(<ThemeQuickPresets theme="dark" onThemeChange={onThemeChange} />);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('renders a button for each valid theme key', () => {
    render(<ThemeQuickPresets theme="dark" onThemeChange={onThemeChange} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(validKeys.length);
  });

  it('active theme button has aria-pressed="true"', () => {
    render(<ThemeQuickPresets theme="dark" onThemeChange={onThemeChange} />);
    const activeBtn = screen.getByRole('button', { name: /apply dark theme/i });
    expect(activeBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('inactive theme buttons have aria-pressed="false"', () => {
    render(<ThemeQuickPresets theme="dark" onThemeChange={onThemeChange} />);
    const inactiveKey = validKeys.find((k) => k !== 'dark')!;
    const inactiveBtn = screen.getByRole('button', {
      name: new RegExp(`apply ${inactiveKey} theme`, 'i'),
    });
    expect(inactiveBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('clicking a button calls onThemeChange with correct theme key', async () => {
    const user = userEvent.setup();
    render(<ThemeQuickPresets theme="dark" onThemeChange={onThemeChange} />);
    const inactiveKey = validKeys.find((k) => k !== 'dark')!;
    const inactiveBtn = screen.getByRole('button', {
      name: new RegExp(`apply ${inactiveKey} theme`, 'i'),
    });
    await user.click(inactiveBtn);
    expect(onThemeChange).toHaveBeenCalledWith(inactiveKey);
  });
});

describe('ThemeQuickPresets — responsive rendering and accessible color palettes', () => {
  const onThemeChange = vi.fn();

  beforeEach(() => {
    onThemeChange.mockClear();
  });

  it('renders buttons inside a flex container for responsive layout', () => {
    const { container } = render(<ThemeQuickPresets theme="dark" onThemeChange={onThemeChange} />);
    const wrapper = container.querySelector('div');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.style.display).toBe('flex');
    expect(wrapper!.style.flexWrap).toBe('wrap');
  });

  it('highcontrast theme button is present and accessible', () => {
    render(<ThemeQuickPresets theme="highcontrast" onThemeChange={onThemeChange} />);
    const btn = screen.getByRole('button', { name: /apply highcontrast theme/i });
    expect(btn).toBeDefined();
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Apply highcontrast theme');
  });
});
