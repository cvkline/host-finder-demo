This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project is a very simple Canvas host finder demonstration. It includes
a tiny API endpoint that does nothing but relay the request for Canvas accounts
on to canvas.instructure.com. (In real life the Javascript fetch would go
straight to Canvas but until CORS is added for that endpoint this is the
only way it will work.

Other than all the Next.js boilerplate that came along for the ride, the "meat" of this is in the
`HostFinder.js` code in the `components` directory. This is a React component that was pretty much
lifted straight from code in Canvas LMS that performed the same function (but is now dead code).
The `onNewSearchTerm` function is the main smarts for dealing with the Canvas API.

Two key points:

* Be sure to preserve the debouncing of input so that the page doesn't make a new API request on
every keystroke... that would be bad.
* The API endpoint is actually paginated and returns only `NRESULTS` results at a time; we use that
fact to implement a pared-down search by only grabbing the first page and then using the number of
pages available as an indication of whether there are "a few more" or "**many** more" results, to
help the user prune down their search. Pay attention to the handling of the `Link` HTTP header in
the returned results

## Getting Started with local development

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

