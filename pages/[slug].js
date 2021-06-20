import DefaultLayout from '@/layouts/default'
import FullWidthLayout from '@/layouts/fullwidth'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { createHash } from 'crypto'

const BlogPost = ({ post, blockMap, emailHash }) => {
  if (!post) return null
  return (
    <>
      {post.fullWidth ? (
        <FullWidthLayout
          blockMap={blockMap}
          frontMatter={post}
          emailHash={emailHash}
        ></FullWidthLayout>
      ) : (
        <DefaultLayout
          blockMap={blockMap}
          frontMatter={post}
          emailHash={emailHash}
        ></DefaultLayout>
      )}
    </>
  )
}

export async function getStaticPaths() {
  const posts = await getAllPosts()
  return {
    paths: posts.map(row => `${BLOG.path}/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  const posts = await getAllPosts()
  const post = posts.find(t => t.slug === slug)
  const blockMap = await getPostBlocks(post.id)
  const emailHash = createHash('md5').update(BLOG.email).digest('hex')

  return {
    props: { post, blockMap, emailHash },
    revalidate: 1
  }
}

export default BlogPost
