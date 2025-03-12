import * as React from 'react';
import Markdown from 'react-markdown';
import PythonLogo from '../images/python.svg';
import HTMLLogo from '../images/html.svg';
import JSLogo from '../images/js.svg';
import TSLogo from '../images/ts.svg';
import CSharpLogo from '../images/csharp.svg';
import type { Repository } from '../data/types';

const ymdRe = /^([0-9]{4})-([0-9]{2})(?:-([0-9]{2}))?$/;

function getDateBadge(date: string) {
  const ymdMatch = ymdRe.exec(date);
  if (ymdMatch) {
    return (
      <span className="date" title={date}>
        <span className="year">{ymdMatch[1]}</span>
        <span> &middot; </span>
        <span className="month">{ymdMatch[2]}</span>
      </span>
    );
  }
  return null;
}

const LANGUAGE_BADGE_WIDTH = 20;

function getLanguageBadge(language: string | undefined) {
  language = `${language}`.toLowerCase();
  if (language.includes('python')) {
    return <img src={PythonLogo.src} alt="Python" width={LANGUAGE_BADGE_WIDTH} />;
  }
  if (language === 'html') {
    return <img src={HTMLLogo.src} alt="HTML" width={LANGUAGE_BADGE_WIDTH} />;
  }
  if (language === 'javascript') {
    return <img src={JSLogo.src} alt="JavaScript" width={LANGUAGE_BADGE_WIDTH} />;
  }
  if (language === 'typescript') {
    return <img src={TSLogo.src} alt="TypeScript" width={LANGUAGE_BADGE_WIDTH} />;
  }
  if (language.includes('c#')) {
    return <img src={CSharpLogo.src} alt="C#" width={LANGUAGE_BADGE_WIDTH} />;
  }
  return null;
}

function MultiLink({ url, text }: { url: string | string[] | undefined; text: string }) {
  if (!url) return null;
  const urls = Array.isArray(url) ? url : url.split(',');
  if (urls.length > 1) {
    return (
      <>
        {text}{' '}
        {urls.map((u, index) => (
          <a key={u} href={u} target="_blank">
            {index + 1}
          </a>
        ))}
      </>
    );
  }
  return (
    <a href={urls[0]} target="_blank">
      {text}
    </a>
  );
}

export default function RepoCard({ repo }: { repo: Repository }) {
  const { date, description, download, homepage, language, name, platform, status, url } = repo;
  const dateBadge = getDateBadge(date);
  const languageBadge = getLanguageBadge(language);
  return (
    <div className="repo-card" id={name.toLowerCase()}>
      <div className="repo-header">
        <h3>{name}</h3>
        <span className="spacer" />
        {dateBadge}
        {languageBadge}
      </div>
      <Markdown>{description || 'Who knows what this thing does...'}</Markdown>
      <div className="repo-bar">
        {date && !dateBadge ? <span>{date}</span> : null}
        {language ? <span>{language}</span> : null}
        {platform ? <span>{platform}</span> : null}
        {status ? <span>Status: {status}</span> : null}
      </div>
      <div className="repo-bar">
        <MultiLink url={homepage} text="View online" />
        <MultiLink url={download} text="Download" />
        <MultiLink url={url} text="Repository" />
      </div>
    </div>
  );
}
