"use client";

import { shortAmount } from "@/lib/utils";
import { AreaChart } from "@tremor/react";

const chartdata = [
  {
    date: "Jan 22",
    Savings: 2890,
    Expenses: 2338,
  },
  {
    date: "Feb 22",
    Savings: 2756,
    Expenses: 2103,
  },
  {
    date: "Mar 22",
    Savings: 3322,
    Expenses: 2194,
  },
  {
    date: "Apr 22",
    Savings: 3470,
    Expenses: 2108,
  },
  {
    date: "May 22",
    Savings: 3475,
    Expenses: 1812,
  },
  {
    date: "Jun 22",
    Savings: 3129,
    Expenses: 1726,
  },
  {
    date: "Jul 22",
    Savings: 3490,
    Expenses: 1982,
  },
  {
    date: "Aug 22",
    Savings: 2903,
    Expenses: 2012,
  },
  {
    date: "Sep 22",
    Savings: 2643,
    Expenses: 2342,
  },
  {
    date: "Oct 22",
    Savings: 2837,
    Expenses: 2473,
  },
  {
    date: "Nov 22",
    Savings: 2954,
    Expenses: 3848,
  },
  {
    date: "Dec 22",
    Savings: 3239,
    Expenses: 3736,
  },
];

const dataFormatter = (number: number) => shortAmount(number, 0);

export function AreaChartHero() {
  return (
    <AreaChart
      className="h-80 "
      data={chartdata}
      index="date"
      categories={["Savings", "Expenses"]}
      colors={["emerald", "rose"]}
      valueFormatter={dataFormatter}
      yAxisWidth={40}
      onValueChange={(v) => console.log(v)}
      xAxisLabel="Month of Year"
      yAxisLabel="Amount (INR)"
    />
  );
}
