/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import _ from "lodash";
import {sql} from "@vercel/postgres";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getLastStateHistoryStaging, getStateHistoryIn} from "@/lib/api/indexer";

// async function saveStateIds(stateIds: string[]) {
//   "use server";
//   await sql`
//     INSERT INTO diferences (name)
//     VALUES ${stateIds.map((id) => `(${id})`).join(", ")}
//   `;
// }

export default async function Home() {
  const staging = await getLastStateHistoryStaging();
  const lastStagingTimestamp = staging.filter(Boolean)[0]?.stateHistory?.at(0)?.timestamp;
  const stateIds = staging
    .map((s) => s.stateHistory.at(0)?.stateId ?? false)
    .filter(Boolean) as string[];

  const {mainnet, pre_prod} = await getStateHistoryIn(stateIds);

  if (!staging.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>Timestamp: {lastStagingTimestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="rounded-sm bg-white/90 p-5 text-black">No data</pre>
        </CardContent>
      </Card>
    );
  }

  //compare if the state history im staging is the same in mainnet and pre_prod
  const equalsToMainnet = _.isEqual(staging, mainnet);
  const equalsToPreProd = _.isEqual(staging, pre_prod);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result</CardTitle>
        <CardDescription>Timestamp: {lastStagingTimestamp}</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="rounded-sm bg-white/90 p-5 text-black">
          equalsToMainnet: {JSON.stringify(equalsToMainnet, null, 2)}
          equalsToPreProd: {JSON.stringify(equalsToPreProd, null, 2)}
          {JSON.stringify(mainnet.length, null, 2)}
          {JSON.stringify(pre_prod.length, null, 2)}
          {JSON.stringify(staging.length, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
