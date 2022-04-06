export interface IArtist {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
  image: {
    "#text": string;
    size: string;
  }[];
}

export interface ISearchQuery {
  "#text": string;
  role: string;
  searchTerms: string;
  startPage: number;
}

export interface IResultMeta {
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
}

export interface IResult {
  items: IArtist[] | string[];
  meta: IResultMeta;
}

export interface ISearchResult {
  results: {
    "opensearch:Query": ISearchQuery;
    "opensearch:totalResults": number;
    "opensearch:startIndex": number;
    "opensearch:itemsPerPage": number;
    "artistmatches": {
      artist: IArtist[] | string[];
    }
    "@attr": {
      for: string;
    }
  }
}