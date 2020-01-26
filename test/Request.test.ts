import { Request, RequestListener } from '../src'

class BlogPost {
  id: number | null = null
  title: string | null = null
  body: string | null = null
  userId: number | null = null
}

class BlogPostWithCallbackResponses extends BlogPost {
  onBeforeResponseCount = 0
  onBeforeSerializationCount = 0
  onAfterSerializationCount = 0

  onBeforeResponse() {
    this.onBeforeResponseCount++
  }

  onBeforeSerialization() {
    this.onBeforeSerializationCount++
  }

  onAfterSerialization() {
    this.onAfterSerializationCount++
  }
}

describe("Request", () => {
  it("can simply get a BlogPost", async () => {
    const respBlogPost = await Request.get('https://jsonplaceholder.typicode.com/posts/1')
      .as(BlogPost)
      .getData()

    expect(respBlogPost).toEqual({
      body: `quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto`,
      id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      userId: 1
    })
  })
  it("can get a BlogPost with many features", async () => {
    let startCbCount = 0
    let endCbCount = 0
    RequestListener.onRequestStart('foo', () => startCbCount++)
    RequestListener.onRequestEnd('foo', () => endCbCount++)
    const startCb = () => {/**/}
    const endCb = () => {/**/}
    RequestListener.onRequestStart('foo', startCb)
    RequestListener.onRequestEnd('foo', endCb)

    const myBlogPost = new BlogPostWithCallbackResponses()

    await Request.get('https://jsonplaceholder.typicode.com/posts/1')
      .name('foo')
      .delay(500)
      .as(myBlogPost)
      .getData()

    expect(myBlogPost).toEqual({
      body: `quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto`,
      id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      userId: 1,
      onBeforeResponseCount: 1,
      onBeforeSerializationCount: 1,
      onAfterSerializationCount: 1
    })

    expect(startCbCount).toBe(1)
    expect(endCbCount).toBe(1)

    expect(RequestListener.startListenerCount('foo')).toBe(2)
    expect(RequestListener.endListenerCount('foo')).toBe(2)
    expect(RequestListener.startListenerCount('foo', startCb)).toBe(1)
    expect(RequestListener.endListenerCount('foo', endCb)).toBe(1)
    RequestListener.clearListener('foo', startCb)
    expect(RequestListener.startListenerCount('foo')).toBe(1)
    expect(RequestListener.endListenerCount('foo')).toBe(2)
    RequestListener.clearListener('foo', endCb)
    expect(RequestListener.startListenerCount('foo')).toBe(1)
    expect(RequestListener.endListenerCount('foo')).toBe(1)
    expect(RequestListener.startListenerCount('foo', startCb)).toBe(0)
    expect(RequestListener.endListenerCount('foo', endCb)).toBe(0)
    RequestListener.clearListener('foo')
    expect(RequestListener.startListenerCount('foo')).toBe(0)
    expect(RequestListener.endListenerCount('foo')).toBe(0)
  })
  it("can get an array of BlogPost", async () => {
    const blogPosts = await Request.get('https://jsonplaceholder.typicode.com/posts')
      .asArrayOf(BlogPost)
      .name('bar')
      .delay(500)
      .getData()

    expect(blogPosts.length).toBeGreaterThan(1)

    expect(blogPosts[0]).toEqual({
      body: `quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto`,
      id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      userId: 1
    })
  })
  it("can head a BlogPost", async () => {
    const resp = await Request.head('https://jsonplaceholder.typicode.com/posts/1')
      .asString()
      .getResponse()

    expect(resp.status).toBe(200)
    expect(resp.data).toBe("")
  })
  it("can post a BlogPost", async () => {
    const myBlogPost = new BlogPost()

    await Request.post('https://jsonplaceholder.typicode.com/posts/', myBlogPost)
      .as(myBlogPost)
      .getData()

    expect(myBlogPost).toEqual({"id": 101, "body": null,"title": null, "userId": null})
  })
  it("can put a BlogPost", async () => {
    const myBlogPost = new BlogPost()
    myBlogPost.id = 1
    myBlogPost.body = 'no great news today, the rich are getting richer'

    await Request.put('https://jsonplaceholder.typicode.com/posts/1', myBlogPost)
      .as(myBlogPost)
      .getData()

    expect(myBlogPost).toEqual({
      id: 1,
      body: 'no great news today, the rich are getting richer',
      title: null,
      userId: null
    })
  })
  it("can patch a BlogPost", async () => {
    const respBlogPost = new BlogPost()

    await Request.patch('https://jsonplaceholder.typicode.com/posts/1',
      { body: 'no great news today, the rich are getting richer' })
      .as(respBlogPost)
      .getData()

    expect(respBlogPost).toEqual({
      id: 1,
      body: 'no great news today, the rich are getting richer',
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      userId: 1,
    })
  })
  it("can delete a BlogPost", async () => {
    const resp = await Request.delete('https://jsonplaceholder.typicode.com/posts/1')
      .asAny()
      .getResponse()

    expect(resp.status).toBe(200)
    expect(resp.data).toEqual({})
  })
  it("can use asVoid", async () => {
    const resp = await Request.delete('https://jsonplaceholder.typicode.com/posts/1')
      .asVoid()
      .getResponse()

    expect(resp.status).toBe(200)
    expect(resp.data).toEqual({})
  })
  it("throws error when responseType is different than object or function", async () => {
    await expect(Request.get('https://jsonplaceholder.typicode.com/posts/1')
        .as(3)
        .getResponse())
      .rejects.toThrow()
  })
})
