import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import App from '../App';
import Home from '../pages/Home';
import AuthenticatedUsers from '../components/AuthenticatedUsers/AuthenticatedUsers';
import ForgotPasswordCard from '../components/ForgotPasswordCard/ForgotPasswordCard';
import NotFound from '../components/NotFound/NotFound';
import Search from '../pages/Search';
import Watchlist from '../pages/Watchlist';
import Settings from '../pages/Settings';
import Movies from '../pages/Movies';
import Tv from '../pages/Tv';

export const routes = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<App />}>
				{/* Private routes */}
				<Route
					index
					element={
						<AuthenticatedUsers>
							{' '}
							<Home />{' '}
						</AuthenticatedUsers>
					}
				/>

				<Route
					path="/search"
					element={
						<AuthenticatedUsers>
							<Search />
						</AuthenticatedUsers>
					}
				/>

				<Route
					path="/watchlist"
					element={
						<AuthenticatedUsers>
							<Watchlist />{' '}
						</AuthenticatedUsers>
					}
				/>

				<Route
					path="/settings"
					element={
						<AuthenticatedUsers>
							<Settings />{' '}
						</AuthenticatedUsers>
					}
				/>
				<Route
					path="/movies"
					element={
						<AuthenticatedUsers>
							{' '}
							<Movies />{' '}
						</AuthenticatedUsers>
					}
				/>

				<Route
					path="/tv-shows"
					element={
						<AuthenticatedUsers>
							<Tv />
						</AuthenticatedUsers>
					}
				/>
				{/* Public routes */}
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/forgot-password" element={<ForgotPasswordCard />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</>
	)
);
