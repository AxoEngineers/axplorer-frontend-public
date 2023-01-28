import './style.scss';

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";


Sentry.init({
	dsn: "https://93d8c41cfd12487d8fc21b0cdc739199@o1309703.ingest.sentry.io/6556103",
	integrations: [new Integrations.BrowserTracing()],

	tracesSampleRate: 0.1,
});

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: { }
});

export default app;