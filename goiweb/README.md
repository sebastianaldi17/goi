# goiweb
A frontend for goi

## Running locally
Before running locally, copy `env.example` to `.env` & update the value of `NEXT_PUBLIC_BACKEND_URL` to where the backend is hosted (might be localhost with different URL, might be a remote server)

Then, run the following command

```bash
npm run dev
```

## To-do list
- [ ] Tidy up css files
- [ ] Fix errors to show in the UI instead of using `alert()`
- [ ] Standardize loading behavior (then/catch/finally vs setTimeout)