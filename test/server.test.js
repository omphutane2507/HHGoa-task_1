const test = require("node:test");
const assert = require("node:assert/strict");

test("server exports a reusable app and rejects missing uploads", async () => {
  const { createServer } = require("../server.js");

  assert.ok(createServer, "Expected createServer export");

  const server = createServer(0);
  const address = await new Promise((resolve) => {
    server.listen(0, () => resolve(server.address()));
  });

  const response = await fetch(
    `http://127.0.0.1:${address.port}/convert-heic`,
    {
      method: "POST",
    },
  );

  assert.equal(response.status, 400);

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});
