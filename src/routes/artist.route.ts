import { Router } from 'express';
import validate from '../middlewares/validate';
import { ArtistController } from '../controllers/artist.controller';
import { ArtistValidation } from '../validations/artist.validation';

export class ArtistRoute {
  public router: Router;
  private artistController: ArtistController;
  private artistValidation: ArtistValidation;

  constructor() {
    this.router = Router();
    this.artistController = new ArtistController();
    this.artistValidation = new ArtistValidation();
    this.routes();
  }

  public routes(): void {
    this.router.route('/artist.search').get(validate(this.artistValidation.search), this.artistController.searchArtist);
  }
}
