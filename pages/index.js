import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

// InstUI really doesn't like being rendered server-side
const HostFinderModalNoSSR = dynamic(() => import('../components/HostFinder'), { ssr: false });

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mini app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Demonstration of the Canvas Host Finder</h1>
        <p>(Code for this demo is on <a href="https://github.com/cvkline/host-finder-demo">GitHub)</a></p>
        <HostFinderModalNoSSR />
      </main>

      <footer className={styles.footer}>
        created by &nbsp; <a href="https://github.com/cvkline">cvk</a>
      </footer>
    </div>
  )
}
