import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useAppSelector, useAppDispatch} from '../../hooks';
import {fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction} from '../../store/api-actions';
import {getOffer, getOffersNearby, getReviews, getLoadedDataStatus} from '../../store/offer-process/selectors';
import {getAuthorizationStatus} from '../../store/user-process/selectors';
import {AuthorizationStatus, OfferCardType, GALLERY_ITEMS_MAX, OFFER_TYPE} from '../../const';
import {calcWidthRating} from '../../utils/utils';
import Footer from '../../components/footer/footer';
import Logo from '../../components/logo/logo';
import Map from '../../components/map/map';
import BookmarkButton from '../../components/bookmark-button/bookmark-button';
import NearPlacesList from '../../components/near-places-list/near-places-list';
import ReviewsForm from '../../components/reviews-form/reviews-form';
import ReviewsList from '../../components/reviews-list/reviews-list';
import UserNav from '../../components/user-nav/user-nav';
import LoadingScreen from '../../pages/loading-screen/loading-screen';
import NotFoundScreen from '../not-found-screen/not-found-screen';

function PropertyScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const {offerId} = useParams();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isDataLoaded = useAppSelector(getLoadedDataStatus);
  const nearbyOffers = useAppSelector(getOffersNearby);
  const offer = useAppSelector(getOffer);
  const reviews = useAppSelector(getReviews);
  const mapOffers = nearbyOffers.slice();

  if (offer) {
    mapOffers.unshift(offer);
  }

  useEffect(() => {
    dispatch(fetchOfferAction(offerId));
  }, [offerId, dispatch]);

  useEffect(() => {
    if (offer) {
      dispatch(fetchReviewsAction(offerId));
    }
  }, [offerId, offer, dispatch]);

  useEffect(() => {
    if (offer) {
      dispatch(fetchNearbyOffersAction(offerId));
    }
  }, [offerId, offer, dispatch]);

  if (isDataLoaded) {
    return (
      <LoadingScreen />
    );
  }

  if (!offer) {
    return <NotFoundScreen />;
  }

  const {id, title, description, images, type, bedrooms, maxAdults, price, isPremium, isFavorite, rating, goods, host} = offer;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <Logo />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="page__main page__main--property">
        <section className="property">
          {images &&
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {images.slice(0, GALLERY_ITEMS_MAX).map((image) => (
                <div className="property__image-wrapper" key={image}>
                  <img className="property__image" src={image} alt="" />
                </div>
              ))}
            </div>
          </div>}
          <div className="property__container container">
            <div className="property__wrapper">
              {isPremium &&
              <div className="property__mark">
                <span>Premium</span>
              </div>}
              <div className="property__name-wrapper">
                <h1 className="property__name">{title}</h1>
                <BookmarkButton offerId={id} isFavorite={isFavorite} cardType={OfferCardType.Property} />
              </div>
              <div className="property__rating rating">
                <div className="property__stars rating__stars">
                  <span style={{width: `${calcWidthRating(rating)}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="property__rating-value rating__value">{rating}</span>
              </div>
              <ul className="property__features">
                <li className="property__feature property__feature--entire">
                  {OFFER_TYPE[type]}
                </li>
                <li className="property__feature property__feature--bedrooms">
                  {`${bedrooms} Bedrooms`}
                </li>
                <li className="property__feature property__feature--adults">
                  {`Max ${maxAdults} adults`}
                </li>
              </ul>
              <div className="property__price">
                <b className="property__price-value">&euro;{price}</b>
                <span className="property__price-text">&nbsp;night</span>
              </div>
              {goods &&
              <div className="property__inside">
                <h2 className="property__inside-title">What&apos;s inside</h2>
                <ul className="property__inside-list">
                  {goods.map((item) => (
                    <li className="property__inside-item" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>}
              <div className="property__host">
                <h2 className="property__host-title">Meet the host</h2>
                <div className="property__host-user user">
                  <div className={`property__avatar-wrapper user__avatar-wrapper${host.isPro ? ' property__avatar-wrapper--pro ' : ''}`}>
                    <img className="property__avatar user__avatar" src="img/avatar-angelina.jpg" width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="property__user-name">
                    {host.name}
                  </span>
                  {host.isPro &&
                  <span className="property__user-status">
                    Pro
                  </span>}
                </div>
                <div className="property__description">
                  <p className="property__text">
                    {description}
                  </p>
                </div>
              </div>
              <section className="property__reviews reviews">
                <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviews.length}</span></h2>
                <ReviewsList reviews={reviews} />
                {authorizationStatus === AuthorizationStatus.Auth &&
                  <ReviewsForm offerId={offer.id} />}
              </section>
            </div>
          </div>
          <section className="property__map map">
            {mapOffers &&
            <Map offers={mapOffers} selectedOffer={mapOffers[0]} />}
          </section>
        </section>
        {nearbyOffers &&
        <div className="container">
          <NearPlacesList offers={nearbyOffers} />
        </div>}
      </main>

      <Footer />
    </div>
  );
}

export default PropertyScreen;
