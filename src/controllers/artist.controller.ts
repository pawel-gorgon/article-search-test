import { Request, Response } from 'express';
import { ArtistService } from '../services/artist.service';
import { catchAsync } from '../utils';
import httpStatus from "http-status";

// mock data
import ARTISTS from '../mock/artists.json';

export class ArtistController {
  private artistService: ArtistService;

  constructor(artistService = new ArtistService()) {
    this.artistService = artistService;
  }

  public searchArtist = catchAsync(async (req: Request, res: Response) => {
    const { searchTerms = '', startPage = '1' } = req.query;
    const artists = await this.artistService.searchArtists(searchTerms.toString(), parseInt(startPage.toString()));

    res.status(httpStatus.OK).json({
      results: {
        "opensearch:Query": {
          "#text": "",
          "role": "request",
          "searchTerms": searchTerms,
          "startPage": startPage
        },
        "opensearch:totalResults": artists.meta.totalResults,
        "opensearch:startIndex": artists.meta.startIndex,
        "opensearch:itemsPerPage": artists.meta.itemsPerPage,
        "artistmatches": {
          "artist": artists.items
        },
        "@attr": {
          "for": searchTerms
        }
      }
    });
  });
}
