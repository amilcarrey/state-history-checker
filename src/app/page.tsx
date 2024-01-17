/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import _ from "lodash";
import {sql} from "@vercel/postgres";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getLastStateHistoryStaging, getStateHistoryIn} from "@/lib/api/indexer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

async function saveStateIds(stateIds: string) {
  "use server";
  const response = await sql`
    INSERT INTO statehistory (StateId)
    VALUES ${stateIds}
  `;

  return response;
}

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

  // const param = ["test", "test2"].map((id) => `(\'${id}\')`).join(", ");

  // console.log(param);

  // const res = await saveStateIds(param);

  return (
    <Card>
      <CardHeader>
        <CardTitle>State History Checker</CardTitle>
        <CardDescription>Timestamp: {lastStagingTimestamp}</CardDescription>
        <CardDescription className="flex justify-start gap-3">
          <Badge variant="outline">Production: {equalsToMainnet ? "🟢" : "🔴"}</Badge>
          <Badge variant="outline">Pre-Prod: {equalsToPreProd ? "🟢" : "🔴"}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl">Result</h1>
        <Accordion collapsible type="single">
          <AccordionItem value="staging">
            <AccordionTrigger>Staging</AccordionTrigger>
            <AccordionContent>
              <pre className="rounded-sm bg-white/90 p-5 text-black">
                {JSON.stringify(staging, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pre-prod">
            <AccordionTrigger>Pre-prod</AccordionTrigger>
            <AccordionContent>
              <pre className="rounded-sm bg-white/90 p-5 text-black">
                {JSON.stringify(pre_prod, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="prod">
            <AccordionTrigger>Production</AccordionTrigger>
            <AccordionContent>
              <pre className="rounded-sm bg-white/90 p-5 text-black">
                {JSON.stringify(mainnet, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
