import Head from 'next/head';
import Repos from '../components/Repos';
// @ts-ignore
import Hello from '../components/Hello.mdx';

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
