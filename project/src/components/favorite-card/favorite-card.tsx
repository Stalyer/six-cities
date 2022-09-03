import {Link} from 'react-router-dom';
import {AppRoute, OfferCardType, OFFER_TYPE} from '../../const';
import {calcWidthRating} from '../../utils/utils';
import {Offer} from '../../types/offer';
import BookmarkButton from '../../components/bookmark-button/bookmark-button';

type FavoriteCardProps = {
  offer: Offer;
}

function FavoriteCard({offer} : FavoriteCardProps): JSX.Element {
  const {id, title, type, previewImage, price, isPremium, isFavorite, rating} = offer;

  return (
    <article className="favorites__card place-card">
      {isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={`${AppRoute.Room}/${id}`}>
          <img className="place-card__image" src={previewImage} width="150" height="110" alt={title} />
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}&nbsp;</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <BookmarkButton offerId={id} isFavorite={isFavorite} cardType={OfferCardType.Place} />
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${calcWidthRating(rating)}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Room}/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{OFFER_TYPE[type]}</p>
      </div>
    </article>
  );
}

export default FavoriteCard;
