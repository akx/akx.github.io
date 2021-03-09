import * as React from 'react';
import Markdown from 'react-markdown';

function massageDate(date) {
  if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) return date.substr(0, 7);
  return date;
}

export default function RepoCard({
  repo,
}) {
  const {
    date, description, download, homepage, language, name, platform, status, url,
  } = repo;
  return (
    <div>
      <h3>{name}</h3>
      <Markdown>{description || 'Who knows what this thing does...'}</Markdown>
      <ul>
        <li>{massageDate(date)}</li>
        {language ? <li>{language}</li> : null}
        {platform ? (
          <li>
            Platform:
            {' '}
            {language}
          </li>
        ) : null}
        {status ? (
          <li>
            Status:
            {' '}
            {status}
          </li>
        ) : null}
        {homepage ? (
          <li>
            Online:
            {' '}
            <a href={homepage} target="_blank">{homepage}</a>
          </li>
        ) : null}
        {download ? (
          <li>
            Download:
            {' '}
            <a href={download} target="_blank">{download}</a>
          </li>
        ) : null}
        {url ? (
          <li>
            Repo:
            {' '}
            <a href={url} target="_blank">{url}</a>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
