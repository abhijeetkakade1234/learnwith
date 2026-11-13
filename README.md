# Learnwith

An interactive, installable learning notebook for system design and Avalanche blockchain.

## Run locally

```sh
npm ci
npm run dev
```

## Deploy to Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages. Choose **Next.js (Static HTML Export)**, production branch `main`, build command `npm run build`, and output directory `out`. Add `learnwith.abhijeetkakade.in` in the Pages project's **Custom domains** settings. New pushes to `main` then deploy automatically.

The site is static and requires no environment variables. It includes a web app manifest and a service worker for installability and offline access to previously visited pages.
