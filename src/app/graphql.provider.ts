import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { PLATFORM_ID } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { Router } from '@angular/router';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@env/environment';

const uri = environment.apiUrl;

export function apolloOptionsFactory(
	httpLink: HttpLink,
	router: Router,
	platformId: Object
): ApolloClientOptions<any> {
	const authLink = setContext((operation, context) => {
		const isBrowser = isPlatformBrowser(platformId);
		const token = isBrowser ? localStorage.getItem('token') : null;
		return {
			headers: {
				...context['headers'],
				Authorization: token ? `Bearer ${token}` : '',
			},
		};
	});

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		const isBrowser = isPlatformBrowser(platformId);

		if (graphQLErrors) {
			graphQLErrors.forEach(({ message, extensions }) => {
				if (isBrowser && extensions?.['code'] === 'UNAUTHENTICATED') {
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					router.navigate(['/']);
				}
			});
		}

		if (networkError && (networkError as any).statusCode === 401 && isBrowser) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			router.navigate(['/']);
		}
	});

	const link = authLink.concat(errorLink).concat(httpLink.create({ uri }));

	return {
		link,
		cache: new InMemoryCache(),
	};
}

export const graphqlProvider = [
	Apollo,
	{
		provide: APOLLO_OPTIONS,
		useFactory: apolloOptionsFactory,
		deps: [HttpLink, Router, PLATFORM_ID], // Specify dependencies here
	},
];
