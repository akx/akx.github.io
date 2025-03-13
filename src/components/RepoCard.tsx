import * as React from 'react';
import Markdown from 'react-markdown';
import PythonLogo from '../images/python.svg';
import HTMLLogo from '../images/html.svg';
import JSLogo from '../images/js.svg';
import TSLogo from '../images/ts.svg';
import CSharpLogo from '../images/csharp.svg';
import GitHubLogo from '../images/gh.svg';
import RustLogo from '../images/rust.svg';
import type { Repository } from '../data/types';
import cx from 'clsx';
import { statusTiers } from '../data/consts';

const ymdRe = /^([0-9]{4})-([0-9]{2})(?:-([0-9]{2}))?$/;

function getDateBadge(date: string) {
  const ymdMatch = ymdRe.exec(date);
  if (ymdMatch) {
    return (
      <span className="date whitespace-nowrap" title={date}>
        {ymdMatch[1]} &middot; {ymdMatch[2]}
      </span>
    );
  }
  return null;
}

const languageBadgeClassName = 'h-6 aspect-square';

function getLanguageBadge(language: string | undefined) {
  language = `${language}`.toLowerCase();
  if (language.includes('python')) {
    return <img src={PythonLogo.src} alt="Python" className={languageBadgeClassName} />;
  }
  if (language === 'html') {
    return <img src={HTMLLogo.src} alt="HTML" className={languageBadgeClassName} />;
  }
  if (language === 'javascript') {
    return <img src={JSLogo.src} alt="JavaScript" className={languageBadgeClassName} />;
  }
  if (language === 'typescript') {
    return <img src={TSLogo.src} alt="TypeScript" className={languageBadgeClassName} />;
  }
  if (language === 'rust') {
    return <img src={RustLogo.src} alt="Rust" className={languageBadgeClassName} />;
  }
  if (language.includes('c#')) {
    return <img src={CSharpLogo.src} alt="C#" className={languageBadgeClassName} />;
  }
  return null;
}

function formatUrl(url: string) {
  if (url.startsWith('https://github.com')) {
    return (
      <>
        <img src={GitHubLogo.src} className="h-4 inline pe-1" />
        {url.slice(19)}
      </>
    );
  }
  if (url.startsWith('https://akx.github.io/')) {
    return 'akx.gh.io/' + url.slice(22).replace(/\/$/, '');
  }
  return url;
}

function MultiLink({ url, text }: { url: string | string[] | undefined; text: string }) {
  if (!url) return null;
  const urls = Array.isArray(url) ? url : url.split(',');
  return urls.map((u, index) => (
    <React.Fragment key={u}>
      <dt>
        {text}
        {urls.length > 1 ? ' ' + (index + 1) : null}
      </dt>
      <dd className="truncate">
        <a href={u} className="underline" target="_blank">
          {formatUrl(u)}
        </a>
      </dd>
    </React.Fragment>
  ));
}

export default function RepoCard({ repo }: { repo: Repository }) {
  const { date, description, download, homepage, language, name, platform, status: rawStatus, url } = repo;
  const dateBadge = getDateBadge(date);
  const languageBadge = getLanguageBadge(language);
  const status = rawStatus || 'Sketch';
  return (
    <div
      className={cx(
        'repo-card bg-white/65 border-b-black/65 border',
        statusTiers[status] >= 900 ? 'opacity-50 hover:opacity-100' : null,
      )}
      id={name.toLowerCase()}
    >
      <div className="repo-header min-h-10 p-2 border-b-black/65 border-b gap-2 flex justify-between items-center leading-none">
        <h3 className="font-semibold">{name}</h3>
        <div className="grow"></div>
        {status === 'Release' ? null : <span className="text-sm">{status}</span>}
        {languageBadge}
      </div>
      <div className="prose p-2 leading-tight min-h-20">
        <Markdown>{description || 'Who knows what this thing does...'}</Markdown>
      </div>
      <dl className="p-2 grid grid-cols-[1fr_2fr] text-sm leading-tight">
        {status ? (
          <>
            <dt>Status</dt>
            <dd>{status}</dd>
          </>
        ) : null}
        {date ? (
          <>
            <dt>Date</dt>
            <dd>{dateBadge || date}</dd>
          </>
        ) : null}
        {language ? (
          <>
            <dt>Language</dt>
            <dd>{language}</dd>
          </>
        ) : null}
        {platform ? (
          <>
            <dt>Platform</dt>
            <dd>{platform}</dd>
          </>
        ) : null}
        <MultiLink url={homepage} text="View online" />
        <MultiLink url={download} text="Download" />
        <MultiLink url={url} text="Repository" />
      </dl>
    </div>
  );
}
