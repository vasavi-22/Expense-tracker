import { buildApp } from "./app.js";

const port = Number(process.env.PORT || 4000);
const app = buildApp();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Expense API listening on port ${port}`);
});
