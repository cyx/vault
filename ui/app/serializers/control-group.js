import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';
import { get } from '@ember/object';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    requestEntity: { embedded: 'always' },
    authorizations: { embedded: 'always' },
  },

  normalizeResponse(store, primaryModelClass, payload) {
    let entity = get(payload, 'data.request_entity');
    if (Array.isArray(payload.data.authorizations)) {
      for (let authorization of payload.data.authorizations) {
        authorization.id = authorization.entity_id;
        authorization.name = authorization.entity_name;
      }
    }

    if (entity && Object.keys(entity).length === 0) {
      payload.data.request_entity = null;
    }
    return this._super(...arguments);
  },

  serialize(snapshot) {
    return { accessor: snapshot.id };
  },
});
