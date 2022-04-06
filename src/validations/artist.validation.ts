import Joi from '@hapi/joi';

export class ArtistValidation {
  public search = {
    query: Joi.object().keys({
      searchTerms: Joi.string().allow(''),
      startPage: Joi.string(),
    }),
  };
}
