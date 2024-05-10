import { cn, container } from '@repo/utils';
import type { FC } from 'react';
import Link from 'next/link';
import { StorybookLogo } from '../logos/storybook';
import { ChromaticLogo } from '../logos/chromatic';
import { Form } from './form';
import { footerNav } from './nav';

export interface FooterProps {
  variant?: 'system' | 'home';
}

export const Footer: FC<FooterProps> = ({ variant = 'system' }) => {
  return (
    <div
      className={cn(
        variant !== 'home' &&
          'bg-slate-50 text-slate-800 border-t border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-700',
        variant === 'home' &&
          'bg-homeBackground text-white border-t border-zinc-700',
      )}
    >
      <div className={cn(container, 'lg:px-8 py-12')}>
        <Form variant={variant} />
        <div className="flex flex-wrap mb-6 sm:mb-20">
          {footerNav.map((nav) => (
            <div
              className="flex flex-col w-full gap-3 mb-12 sm:w-1/2 md:flex-1 md:mb-0"
              key={nav.title}
            >
              <div className="font-bold text-md">{nav.title}</div>
              {nav.links.map((link) => {
                if (link.isExternal)
                  return (
                    <a
                      className={cn(
                        'text-zinc-600 hover:text-blue-500 transition-colors text-md',
                        variant === 'home' && 'text-zinc-400',
                        variant !== 'home' &&
                          'text-zinc-600 dark:text-zinc-400',
                      )}
                      href={link.href}
                      key={link.title}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.title}
                    </a>
                  );
                return (
                  <Link
                    className={cn(
                      'text-zinc-600 hover:text-blue-500 transition-colors text-md',
                      variant === 'home' && 'text-zinc-400',
                      variant !== 'home' && 'text-zinc-600 dark:text-zinc-400',
                    )}
                    href={link.href}
                    key={link.title}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-12 sm:flex-row sm:gap-0">
          <div className="flex gap-4 sm:gap-8">
            <div
              className={cn(
                'border-r border-zinc-200 pr-4 sm:pr-8 dark:border-zinc-600',
                variant === 'home' && 'border-zinc-600',
              )}
            >
              <div
                className={cn(
                  'text-sm mb-2',
                  variant === 'home' && 'text-zinc-400',
                  variant !== 'home' && 'text-zinc-600 dark:text-zinc-400',
                )}
              >
                Open source software
              </div>
              <StorybookLogo color={variant === 'home' ? 'white' : 'system'} />
            </div>
            <div>
              <div
                className={cn(
                  'text-sm mb-2',
                  variant === 'home' && 'text-zinc-400',
                  variant !== 'home' && 'text-zinc-600 dark:text-zinc-400',
                )}
              >
                Maintained by
              </div>
              <ChromaticLogo color={variant === 'home' ? 'white' : 'system'} />
            </div>
          </div>
          <div
            className={cn(
              'text-sm',
              variant === 'home' && 'text-zinc-400',
              variant !== 'home' && 'text-zinc-600 dark:text-zinc-400',
            )}
          >
            Special thanks to{' '}
            <a
              className={cn(
                'text-zinc-600 hover:text-blue-500 transition-colors text-md',
                variant === 'home' && 'text-white',
                variant !== 'home' && 'text-zinc-600 dark:text-white',
              )}
              href="https://netlify.com"
            >
              Netlify
            </a>{' '}
            and{' '}
            <a
              className={cn(
                'text-zinc-600 hover:text-blue-500 transition-colors text-md',
                variant === 'home' && 'text-white',
                variant !== 'home' && 'text-zinc-600 dark:text-white',
              )}
              href="https://circleci.com"
            >
              CircleCi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
