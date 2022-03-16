import { asHTML, asText } from "@prismicio/helpers"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { createClient } from "../../services/prismic"
import style from './post.module.scss'

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={style.container}>
        <article className={style.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={style.postContent}
            dangerouslySetInnerHTML={{ __html: post.content}}></div>
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  
  if(!session.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const { slug } = params;
  const prismic = createClient(req)

  const response = await prismic.getByUID('post', String(slug))
  
  
  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    }
  }
}