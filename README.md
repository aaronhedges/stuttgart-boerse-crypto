This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements

Node 20+

```bash
nvm use 20
```

## Getting Started

First, install npm packages:

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Extras

Run jest unit tests:

```bash
npm test
```

## Assumptions

Mocked API for transaction log due to time constraints. Put mock data in /public/mock folder. For initial load of 24 hours of transaction data I load it via nextJS and handle for loading time, error, completion etc. However, as I was running out of time to knock out all items on here I do a direct import of the json data for the cryto transactions and user account data and then inject that data into the redux store. 

I had, in an earlier implementation, setup a functional demo key to coinbase but was still have authorization issues when the demo application was attempting to connect to coinbase. I was able to confirm that the key was valid, so it was probably a minor configuration issue.

I also hardcoded the primary button hex code color as I tried to setup a "primary-color" value in tailwind CSS but ran out of time to get that to work correctly. However, since I got the font to work correctly via tailwind config I consider that a win.

I did unit tests for the TradeModule and Store as a bonus, since I thought these two areas had the potential to change the most frequently in future development and are critical to the primary business value of this application.