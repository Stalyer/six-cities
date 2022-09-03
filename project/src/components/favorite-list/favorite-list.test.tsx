import {render, screen} from '@testing-library/react';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {configureMockStore} from '@jedmao/redux-mock-store';
import HistoryRouter from '../history-router/history-router';
import FavoriteList from './favorite-list';
import {NameSpace, AuthorizationStatus} from '../../const';
import {makeFakeOffers} from '../../utils/mocks';

const mockStore = configureMockStore();
const history = createMemoryHistory();
const fakeOffers = makeFakeOffers();
const fakeStore = mockStore({
  [NameSpace.User]: {
    authorizationStatus: AuthorizationStatus.NoAuth
  }
});

describe('Component: FavoriteList', () => {
  it('should render correctly', () => {
    render(
      <Provider store={fakeStore}>
        <HistoryRouter history={history}>
          <FavoriteList offers={fakeOffers} />
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(new RegExp(fakeOffers[0].title, 'i'))).toBeInTheDocument();
  });
});
