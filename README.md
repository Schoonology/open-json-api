# OJA: Open JSON API

Open API & JSON API? _O, ja!_

A library to make authoring [JSON-API][jsonapi]-compliant (v1) endpoints with
[Open API (née Swagger)][openapi] specifications (v2) a little easier. Both
are highly precise, powerful standards, but their verbosity can make it
difficult to reap their full benefit without headache.

## API

The API snippets below all assume `oja` has been loaded using `require`, like
so:

```
var oja = require('oja')
```

### `oja.normalize(spec, name, obj)`

Normalizes `obj` to a Resource based on the definition of `name` within `spec`.
For example, given the name `Widget` with the following (abbreviated) spec:

```
{
  "type": "widgets",
  "id": "string",
  "attributes": {
    "name": "string",
    "price": "number",
  },
}
```

Both of the following is true:

```
{                                {
  "id": 777,                       "type": "widgets",
  "name": "Example Widget",  =>    "id": "777",
  "price:" 42.99,                  "attributes": {
}                            =>      "name": "Example Widget",
                             =>      "price": 42.99,
                                   },
                                 }

{                                  {
  "type": "widgets",           =>    "type": "widgets",
  "id": "777",                 =>    "id": "777",
  "attributes": {              =>    "attributes": {
    "name": "Example Widget",  =>      "name": "Example Widget",
    "price": 42.99,            =>      "price": 42.99,
  },                                 },
}                                  }
```

### `oja.flatten(obj)`

Flattens `obj` to a single namespace, independent of type. As with `normalize`
Both converting from a Resource and passing in an already-flattened object
should have the same result:

```
{                                  {
  "type": "widgets",           =>    "id": 777,
  "id": "777",                 =>    "name": "Example Widget",
  "attributes": {              =>    "price:" 42.99,
    "name": "Example Widget",      }
    "price": 42.99,
  },
}

{                                {
  "id": 777,                 =>    "id": 777,
  "name": "Example Widget",  =>    "name": "Example Widget",
  "price:" 42.99,            =>    "price:" 42.99,
}                                }
```

### `oja.defineResource(spec, name, options)`

Adds definitions to `spec` suitable for validating and normalizing `name`
Resources. The `options` Object takes the following format, though only `type`
is required:

```
{
  type: 'examples',     // The value of "type" for this kind of Resource.
  attributes: {
    example_attr: {     // Keys within "attributes" become field names in the
                        // finished spec.
      type: 'string',   // Values should be valid Open API Schema Objects
                        // (A subset of JSON Schema).
    }
  },
  relationships: {
    example_rel:        // Keys within "relationships" become field names in
                        // the finished spec.
      'AnotherExample', // Values should correspond to the "name" you give
                        // other Resources (presumably using defineResource).
  }
}
```

More details on the `attributes` Schema Objects can be found in the [Open API
docs][schema-object]

## Where is the `serialize`/`deserialize` method?

With enough cumulative time spent writing endpoints on both the producing and
consuming side of JSONAPI, it turns out that the Resource format is the best
canonical format for honoring the behaviour in the spec. Flattening the
Resource (putting `attributes` keys, `relationships` keys, and `id` into the
same namespace—typically removing `type` in the process) strips it, by
definition, of all its semantic value.

- **Updates**: In order to efficiently process `PATCH` requests on the server,
  we need to know what properties are being updated. Preserving the Resource
  format allows us to cleanly separate attribute updates from new
  relationships. Likewise, client-side, constructing a minimum [update
  request][jsonapi-update] is made easier by dividing the concerns between
  changed attributes and new edges in the graph.
- **Retrieval**: Retaining a focus on Resources as the primary format for
  information similarly promotes the use of Resource Identifiers for retreival.
  Though outside the scope of this library, any code necessary for fetching
  a Resource (e.g. for a top-level UI component in React) can and should pull
  the Resource Identifier from `relationships`, passing that Identifier into
  the module responsible for getting, caching, etc.
- **Caching**: The client-side logic for handling and caching data becomes
  trivial: get, cache, and render Resources. Typically, UI components pluck
  some subset of the `attributes` anyway.
- **Side-Loading**: The server-side logic for [side-loading][side-loading] is
  made simpler by not serializing Resources into [top-level objects][top-level]
  ; otherwise, includes have to be mixed into the result.

As a result of the above points (undoubtedly including more omitted due to a
lapse of memory), the API for both incoming and outgoing Resources is made more
explicit: `normalize` for ensuring an Object matches the expected Resource
format for a given type of Resource, and `flatten` for explicitly converting
the Resource into a POJO. The latter should be used sparingly, but is useful,
for example, for loading Resources into ORMs that expect flattened objects.

## Potential surprises

- Unlike `jsonapi-serializer`, OJA does not automatically fill out `included`.
Instead, individual Resources should be explicitly included, such that the
business logic explicitly handles all cases where only a partial, related
Resource is currently available.

[jsonapi]: http://jsonapi.org/format/
[openapi]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
[schema-object]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
[jsonapi-update]: http://jsonapi.org/format/#crud-updating-resource-attributes
[side-loading]: http://jsonapi.org/format/#fetching-includes
[top-level]: http://jsonapi.org/format/#document-top-level
