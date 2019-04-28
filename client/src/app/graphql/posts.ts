export const getAllGQL = (): string => (`
    query FetchPosts {
        posts {
            id
            title
            content
        }
    }
`)
export const createGQL = (title: string, content: string): string => (`
    mutation CreatePost {
        createPost(postInput: { title: "${title}", content: "${content}" })
    }
`)

export const deleteGQL = (id: string): string => (`
    mutation DeletePost {
        deletePost(postId: "${id}")
    }
`)