"use server";

import { parse } from "node-html-parser";

export async function getStockData(prefix?: string | null, symbol?: string) {
  if (!prefix || !symbol) return;

  const resp = await fetch(
    `https://www.moneycontrol.com/india/stockpricequote/${prefix}/${symbol}`
  );
  const html = await resp.text();
  const doc = parse(html);
  const price = doc.getElementById("nsespotval")?.attributes.value;
  const stockName = doc
    .getElementById("stockName")
    ?.querySelector("h1")?.innerHTML;

  return { stockName, price: parseFloat(price ?? "0") };
}
