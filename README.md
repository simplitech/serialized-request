# Serialized-Request

Make HTTP requests and serialize/deserialize the request and response to Javascript/Typescript class objects.

Serialized-Request uses [Axios](https://github.com/axios/axios) to handle HTTP calls and [Class-Transformer](https://github.com/typestack/class-transformer) to transform plain objects from/to class-objects 

# Install
```
npm i @simpli/serialized-request axios class-transformer
```

# Request Usage
Serialized-Request supports GET, POST, PUT, PATCH, DELETE and HEAD Http Methods

## Import
```typescript
import { Request, RequestListener } from '@simpli/serialized-request'
// RequestListener is optional
```

### Create any class for Request and Response
```typescript
class BlogPost {
  id: number | null = null
  title: string | null = null
  body: string | null = null
  userId: number | null = null
}
```

### Make a GET request with a new Object response
```typescript
const respBlogPost = await Request.get('https://jsonplaceholder.typicode.com/posts/1')
      .as(BlogPost) // we are choosing to transform to a new object of BlogPost class
      .getData()

/*
respBlogPost is a BlogPost object and will be something like this:
{
  body: `quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto`,
  id: 1,
  title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  userId: 1
}
*/
```

### Make a GET request with an Array response
```typescript
const blogPosts = await Request.get('https://jsonplaceholder.typicode.com/posts')
      .asArrayOf(BlogPost) // we are choosing to transform to an array of BlogPost
      .getData()

/*
blogPosts is a BlogPost[] and will be something like this:
[
  {
    body: `quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto`,
    id: 1,
    title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    userId: 1
  },
  ...
]
*/
```

### Make a POST request filling an existing object on response
```typescript
// instantiate an object
const myBlogPost = new BlogPost()
myBlogPost.body = 'no great news today, the rich are getting richer'

// pass the object as the POST request Body
await Request.post('https://jsonplaceholder.typicode.com/posts/', myBlogPost)
  .as(myBlogPost) // and filling its properties on response, PS.: it could be a different object
  .getData()

/* myBlogPost is a BlogPost with the properties filled:
{
  id: 101, // this id was filled by the server response
  body: 'no great news today, the rich are getting richer',
  title: null,
  userId: null
}
*/
```

### Response types
You can use this methods to parse the response:
- `as(MyClass)` - Transforms to a new object of the choosen class
- `as(myInstantiatedObject)` - Fills the properties of the choosen object
- `asArrayOf(MyClass)` - Transforms to an array of the choosen class
- `asString()` - Returns as string
- `asNumber()` - Returns as number
- `asBoolean()` - Returns as boolean
- `asAny()` - Returns as it is
- `asVoid()` - Returns nothing

### Retrive the Response information
```typescript
const resp = await Request.delete('https://jsonplaceholder.typicode.com/posts/1')
  .asVoid()
  .getResponse()

// if successful, resp.status will be 200
// and resp.data will be the response body (use getData() as shortcut)
```

### Add a delay before the request
```typescript
const resp = await Request.head('https://jsonplaceholder.typicode.com/posts/1')
  .delay(2000) // wait 2 seconds before making the request
  .asString()
  .getResponse()
```

### Globally listen to requests
Useful for loading interactions
```typescript
// on this example we are setting counters for when the request start and end
let startCbCount = 0
let endCbCount = 0
const startCb = () => startCbCount++
const endCb = () => endCbCount++

// then we register the listeners passing a name
RequestListener.onRequestStart('foo', startCb)
RequestListener.onRequestEnd('foo', endCb)

// make the request
const myBlogPost = await Request.get('https://jsonplaceholder.typicode.com/posts/1')
  .name('foo') // set the request name here
  .as(BlogPost)
  .getData()

// then the listeners will be called
// startCbCount and endCbCount are both 1 now

RequestListener.clearListener('foo', startCb) // you can remove the specific listener
RequestListener.clearListener('foo') // or remove all listeners of that name
```
Listeners can use the endpoint instead of the request name aswell

### Control the Serialization lifecycle
Sometimes you need to do things before and after the serialization
```typescript
// You only need to implement some methods that will be called during the request
class CallbackResponsesExample {
  onBeforeResponse() {
    // a method called before everything
  }

  onBeforeSerialization() {
    // a method called just before the serialization
  }

  onAfterSerialization() {
    // a method called right after the serialization
  }
}
```

### Ignore fields and map names and types with Annotations
Using Class-Transformer we can control the serialization behaviour

#### `@ResponseSerialize(func)` or `@Type(func)`
[Working with nested objects](https://github.com/typestack/class-transformer#working-with-nested-objects)

#### `@ResponseExpose(name?)` or `@Expose({ name, toClassOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@RequestExpose(name?)` or `@Expose({ name, toPlainOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@HttpExpose(name?)` or `@Expose({ name })`
[Exposing properties with different names](https://github.com/typestack/class-transformer#exposing-properties-with-different-names)

#### `@RequestExclude()` or `@Exclude({ toPlainOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@ResponseExclude()` or `@Exclude({ toClassOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@HttpExclude()` or `@Exclude()`
[Skipping specific properties](https://github.com/typestack/class-transformer#skipping-specific-properties)
