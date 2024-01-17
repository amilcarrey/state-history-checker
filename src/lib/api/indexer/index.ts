/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {gql} from "graphql-request";

import client from "./client";

// const getReservesIndexer = async () => {
//   const StateHistoryQuery = gql`
//     query QueryMoneyMarket {
//       queryMoneyMarket(
//         filter: {address: {eq: "erd1qqqqqqqqqqqqqpgqxmn4jlazsjp6gnec95423egatwcdfcjm78ss5q550k"}}
//         first: 20
//       ) {
//         address
//         stateHistory(first: 1, order: {desc: timestamp}) {
//           timestamp
//           cash
//           borrows
//           reserves
//           stakingRewards
//           revenue
//         }
//       }
//     }
//   `;

//   const mainnetData = await client("mainnet", StateHistoryQuery);
//   const pre_prodData = await client("pre_prod", StateHistoryQuery);
//   const stagingData = await client("staging", StateHistoryQuery);

//   const mainnet = {
//     timestamp: mainnetData?.queryMoneyMarket[0].stateHistory[0].timestamp || "",
//     reserves: mainnetData?.queryMoneyMarket[0].stateHistory[0].reserves || "",
//   };
//   const pre_prod = {
//     timestamp: pre_prodData?.queryMoneyMarket[0].stateHistory[0].timestamp || "",
//     reserves: pre_prodData?.queryMoneyMarket[0].stateHistory[0].reserves || "",
//   };
//   const staging = {
//     timestamp: stagingData?.queryMoneyMarket[0].stateHistory[0].timestamp || "",
//     reserves: stagingData?.queryMoneyMarket[0].stateHistory[0].reserves || "",
//   };

//   return {mainnet, pre_prod, staging};
// };

// const getStateHistory = async (offset) => {
//   const StateHistoryQuery = gql`
//     query QueryMoneyMarket($offset: Int!) {
//       queryMoneyMarket {
//         state
//         address
//         collateralBalance # will be replaced to totalCollateral
//         collateralFactor
//         liquidationIncentive
//         protocolSeizeShare
//         reserveFactor
//         underlying {
//           id
//         }
//         stateHistory(first: 100000, offset: $offset, order: {asc: timestamp}) {
//           timestamp
//           cash
//           borrows
//           reserves
//           stakingRewards
//           revenue
//           totalSupply
//           supplyRatePerSecond
//           borrowRatePerSecond
//         }
//       }
//     }
//   `;

//   const mainnet = (await client("mainnet", StateHistoryQuery, {offset: offset})).queryMoneyMarket;
//   const pre_prod = (await client("pre_prod", StateHistoryQuery, {offset: offset})).queryMoneyMarket;
//   const staging = (await client("staging", StateHistoryQuery, {offset: offset})).queryMoneyMarket;

//   return {mainnet, pre_prod, staging};
// };

const getLastStateHistoryStaging = async () => {
  const StateHistoryQuery = gql`
    query QueryMoneyMarket {
      queryMoneyMarket {
        stateHistory(first: 1, order: {desc: timestamp}) {
          stateId
          borrowRatePerSecond
          timestamp
          cash
          borrows
          revenue
          reserves
          stakingRewards
          totalSupply
          borrowIndex
        }
        underlying {
          symbol
        }
      }
    }
  `;

  const staging = (await client("staging", StateHistoryQuery)) as Result;

  // return {mainnet, pre_prod, staging};
  return staging.queryMoneyMarket;
};

const getStateHistoryIn = async (stateIds: string[]) => {
  const StateHistoryQuery = gql`
    query QueryMoneyMarket($stateIds: [String]) {
      queryMoneyMarket {
        stateHistory(filter: {stateId: {in: $stateIds}}) {
          stateId
          borrowRatePerSecond
          timestamp
          cash
          borrows
          revenue
          reserves
          stakingRewards
          totalSupply
          borrowIndex
        }
        underlying {
          symbol
        }
      }
    }
  `;

  const mainnetPromise = client("mainnet", StateHistoryQuery, {stateIds});
  const pre_prodPromise = client("pre_prod", StateHistoryQuery, {stateIds});

  const [mainnet, pre_prod] = (await Promise.all([mainnetPromise, pre_prodPromise])) as [
    Result,
    Result,
  ];

  return {mainnet: mainnet.queryMoneyMarket, pre_prod: pre_prod.queryMoneyMarket};
};

export interface Result {
  queryMoneyMarket: QueryMoneyMarket[];
}

export interface QueryMoneyMarket {
  stateHistory: StateHistory[];
  underlying: Underlying;
}

export interface StateHistory {
  stateId: string;
  borrowRatePerSecond: string;
  timestamp: string;
  cash: string;
  borrows: string;
  revenue: string;
  reserves: string;
  stakingRewards: string;
  totalSupply: string;
  borrowIndex: string;
}

export interface Underlying {
  symbol: string;
}

export {getLastStateHistoryStaging, getStateHistoryIn};
