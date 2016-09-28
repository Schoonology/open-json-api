# Open JSON API

- Unlike `jsonapi-serializer`, OJA does not automatically fill out `included`.
Instead, individual Resources should be explicitly included, such that the
business logic explicitly handles all cases where only a partial, related
Resource is currently available.

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

## TODO

- [ ] \(De)serializer for JSON API Resources.
- [ ] Swagger generators for common JSON API routes/responses/etc.
- [ ] Error handler for converting error responses to JSON API format.
- [ ] 501-returning handler for unimplemented routes.

[jsonapi-update]: http://jsonapi.org/format/#crud-updating-resource-attributes
[side-loading]: http://jsonapi.org/format/#fetching-includes
[top-level]: http://jsonapi.org/format/#document-top-level
