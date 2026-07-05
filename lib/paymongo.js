const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

export function getPayMongoHeaders() {
  return {
    accept: "application/json",
    "content-type": "application/json",
    authorization:
      "Basic " + Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString("base64"),
  };
}
