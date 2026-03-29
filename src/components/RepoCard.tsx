import * as React from 'react';
import PythonLogo from '../images/python.svg';
import HTMLLogo from '../images/html.svg';
import JSLogo from '../images/js.svg';
import TSLogo from '../images/ts.svg';
import CSharpLogo from '../images/csharp.svg';
import GitHubLogo from '../images/gh.svg';
import RustLogo from '../images/rust.svg';
import Markdown from 'react-markdown';
import type { Repository } from '../data/types';
import cx from 'clsx';

function getLanguageIcon(language: string | undefined) {
  const lang = `${language}`.toLowerCase();
  if (lang.includes('python')) return PythonLogo;
  if (lang === 'html') return HTMLLogo;
  if (lang === 'javascript') return JSLogo;
  if (lang === 'typescript') return TSLogo;
  if (lang === 'rust') return RustLogo;
  if (lang.includes('c#')) return CSharpLogo;
  return null;
}

function formatUrl(url: string) {
  if (url.startsWith('https://github.com')) {
    return url.slice(19);
  }
  if (url.startsWith('https://akx.github.io/')) {
    return 'akx.gh.io/' + url.slice(22).replace(/\/$/, '');
  }
  return url;
}

function SmallLink({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <a href={url} className="underline text-black/70 hover:text-black" target="_blank" title={url}>
      {children}
    </a>
  );
}

export default function RepoCard({ repo, color }: { repo: Repository; color: string }) {
  const { description, download, homepage, language, name, archived, status: rawStatus, url } = repo;
  const status = rawStatus || 'Sketch';
  const isRelease = status === 'Release';
  const isDimmed = archived || status === 'Deprecated' || status === 'Archived';
  const yearMonth = repo.date.slice(0, 7);
  const langIcon = getLanguageIcon(language);
  const homepageUrls = homepage ? (Array.isArray(homepage) ? homepage : homepage.split(',')) : [];
  const downloadUrls = download ? (Array.isArray(download) ? download : download.split(',')) : [];

  let heading = (
    <span className={cx('text-sm whitespace-nowrap', isRelease ? 'font-bold' : 'font-medium')}>{name}</span>
  );

  if (url)
    heading = (
      <a href={url} target="_blank" title={formatUrl(url)}>
        <img src={GitHubLogo.src} alt="" className="h-3.5 inline pr-1" />
        {heading}
      </a>
    );

  return (
    <div
      className={cx(
        'repo-cell flex flex-col',
        isRelease ? 'col-span-2' : '',
        isDimmed ? 'opacity-40 hover:opacity-100' : '',
      )}
      style={{ background: `color-mix(in srgb, ${color} 15%, white)` }}
      id={name.toLowerCase()}
    >
      <div className="flex items-center gap-1 px-1.5 pt-1 leading-tight">
        {heading}
        <span className="grow" />
        {langIcon ? (
          <img src={langIcon.src} alt={language} className="h-4 shrink-0 opacity-70" />
        ) : language ? (
          <span className="text-sm opacity-50 shrink-0">{language}</span>
        ) : null}
      </div>

      <div className="text-sm leading-tight px-1.5 pb-2 prose">
        <Markdown>{description}</Markdown>
      </div>

      <span className="grow" />

      <div className="flex flex-wrap items-center gap-x-1.5 px-1.5 pb-1 pt-0.5 text-sm leading-tight">
        <span className="opacity-60">{yearMonth}</span>
        {status !== 'Release' && status !== 'Sketch' ? <span className="opacity-40">{status}</span> : null}
        {archived ? <span className="opacity-40">Archived</span> : null}
        <span className="grow" />
        {homepageUrls.map((u) => (
          <SmallLink key={u} url={u}>
            Demo
          </SmallLink>
        ))}
        {downloadUrls.map((u) => (
          <SmallLink key={u} url={u}>
            DL
          </SmallLink>
        ))}
      </div>
    </div>
  );
}
