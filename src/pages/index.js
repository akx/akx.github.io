import Head from 'next/head';
import Hello from '../components/Hello.mdx';
import Repos from '../components/Repos';

export default function Home() {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Alegreya" rel="stylesheet" />
        <title>@akx</title>
      </Head>
      <div id="container">
        <Hello />
        <Repos />
      </div>
    </>
  );
}
