import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.postList}>
          <a href='#'>
            <time>12 de março de 2022</time>
            <strong>Creating new titles posts</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit vel incidunt eligendi distinctio laboriosam quam, magnam laudantium rem repellendus reiciendis exercitationem quas temporibus suscipit eius facilis obcaecati culpa praesentium consequuntur!</p>
          </a>

          <a>
            <time>12 de março de 2022</time>
            <strong>Creating new titles posts</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit vel incidunt eligendi distinctio laboriosam quam, magnam laudantium rem repellendus reiciendis exercitationem quas temporibus suscipit eius facilis obcaecati culpa praesentium consequuntur!</p>
          </a>

          <a>
            <time>12 de março de 2022</time>
            <strong>Creating new titles posts</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit vel incidunt eligendi distinctio laboriosam quam, magnam laudantium rem repellendus reiciendis exercitationem quas temporibus suscipit eius facilis obcaecati culpa praesentium consequuntur!</p>
          </a>
        </div>
      </main>
    </>
  );
}