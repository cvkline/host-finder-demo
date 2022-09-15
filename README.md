This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project is a very simple Canvas host finder demonstration. It includes
a tiny API endpoint that does nothing but relay the request for Canvas accounts
on to canvas.instructure.com. (In real life the Javascript fetch would go
straight to Canvas but until CORS is added for that endpoint this is the
only way it will work.

## Getting Started with local development

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

