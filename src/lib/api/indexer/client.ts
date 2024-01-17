import type {Variables} from "graphql-request";

import {request} from "graphql-request";

const MAINNET = "https://mainnet-api.hatom.com/graphql";
const PRE_PROD = "https://mainnet-pre-prod-api.hatom.com/graphql";
const STAGING = "https://mainnet-staging-api.hatom.com/graphql";

const environments = {
  mainnet: MAINNET,
  pre_prod: PRE_PROD,
  staging: STAGING,
};
const client = async (
  environment: "mainnet" | "pre_prod" | "staging",
  query: string,
  variables: Variables = {},
) => {
  const API_URL = environments[environment];

  return request(API_URL, query, variables);
};

export default client;
