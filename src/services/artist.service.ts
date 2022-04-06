import fs from 'fs';
import path from 'path';
import httpStatus from 'http-status';
import fetch from 'node-fetch';

import { ApiError } from "../utils";
import { IArtist, IResult, ISearchResult } from '../definitions/interfaces/artist.interface';
import config from '../config/config';
// mock data
import ARTISTS from '../mock/artists.json';

export class ArtistService {
  constructor() {
  }

  public async searchArtists(searchTerms: string, startPage: number):Promise<IResult> {
    let searchResponse: ISearchResult = await this.fetchArtists(searchTerms, startPage);
    let searchResults: IResult = {
      items: searchResponse.results.artistmatches.artist,
      meta: {
        itemsPerPage: searchResponse.results['opensearch:itemsPerPage'],
        startIndex: searchResponse.results['opensearch:startIndex'],
        totalResults: searchResponse.results['opensearch:totalResults']
      }
    };

    if (!searchResults.items.length) {
      const randomNumber = Math.round(Math.random() * (ARTISTS.length - 5));
      const artists = ARTISTS.slice(randomNumber, randomNumber + 5).map((artist) => artist.name);
      searchResults =  {
        items: artists,
        meta: {
          itemsPerPage: 30,
          startIndex: (parseInt(startPage.toString()) - 1) * 30,
          totalResults: ARTISTS.length,
        }
      };
    } else {
      this.exportCsv(searchResults.items as IArtist[]);
    }

    return searchResults;
  }

  private exportCsv(data: IArtist[]): void {
    try {
      let csvData = `Name,Mbid,Listeners,Url,Image\n`;
      data.forEach((artist) => {
        csvData += `${artist.name},${artist.mbid},${artist.listeners},${artist.url},${artist.image[0]['#text']}\n`;
      });

      const outputPath = path.join(__dirname, "../../csv");
      try {
        fs.mkdirSync(outputPath, { recursive: true });
      } catch { }

      const fileName = `results.csv`;
      const filePath = path.join(outputPath, fileName);
      fs.writeFileSync(filePath, csvData);
    } catch (e) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Exporting CSV failed');
    }
  }

  private async fetchArtists(search: string, startPage = 1): Promise<ISearchResult> {
    const url = `${config.search_api_url}&artist=${search}&page=${startPage}`;
    const response = await fetch(url)

    return await response.json() as ISearchResult
  }
}
