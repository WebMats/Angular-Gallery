export const getAllGQL = (pageSize, after, next): string => (`
    query FetchPosts {
        posts(pageSize: ${pageSize}, after: "${after}", next: ${next}) {
            posts {
                id
                title
                content
                imageURL
                creator
            }
            cursor
            total
            page
        }
    }
`)
export const getOneGQL = (id): string => (`
    query FetchPost {
        post(id: "${id}") {
            id
            title
            content
            imageURL
        }
    }
`)
export const updateOneGQL = (id, updates): string => (`
    mutation UpdatePost {
        updatePost(postId: "${id}", updateInput: { title: "${updates.title}", content: "${updates.content}", imageURL: "${updates.imageURL}" }) {
            id
            title
            content
        } 
    }
`)

export const createGQL = (title: string, content: string, imageURL: string): string => (`
    mutation CreatePost {
        createPost(postInput: { title: "${title}", content: "${content}", imageURL: "${imageURL}" })
    }
`)

export const deleteGQL = (id: string): string => (`
    mutation DeletePost {
        deletePost(postId: "${id}")
    }
`)