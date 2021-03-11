import Head from 'next/head';
import Hello from '../components/Hello.mdx';
import Repos from '../components/Repos';

export default function Home() {
  return (
    <>
      <Head>
        <title>@akx</title>
      </Head>
      <Hello />
      <Repos />
    </>
  );
}
