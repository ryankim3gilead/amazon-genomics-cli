#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import "source-map-support/register";
import { getContextOrDefault } from "../../lib/util";
import { CoreStack } from "../../lib/stacks";
import { Maybe } from "../../lib/types";
import { APP_TAG_KEY, APP_NAME, PRODUCT_NAME, APP_ENV_NAME, AGC_VERSION_KEY } from "../../lib/constants";
import { getEnvString } from "../../lib/env";
const app = new App();

const account: string = process.env.CDK_DEFAULT_ACCOUNT!;
const region: string = process.env.CDK_DEFAULT_REGION!;

const agcVersion = getEnvString(app.node, "AGC_VERSION");
const vpcId = getContextOrDefault<Maybe<string>>(app.node, "VPC_ID");
const bucketName = getContextOrDefault(app.node, `${APP_ENV_NAME}_BUCKET_NAME`, `${APP_NAME}-${account}-${region}`);
const createNewBucket = getContextOrDefault(app.node, `CREATE_${APP_ENV_NAME}_BUCKET`, "true").toLowerCase() == "true";

new CoreStack(app, `${PRODUCT_NAME}-Core`, {
  vpcId,
  bucketName,
  createNewBucket,
  idempotencyKey: agcVersion,
  env: {
    account,
    region,
  },
  tags: {
    [APP_TAG_KEY]: APP_NAME,
    [AGC_VERSION_KEY]: agcVersion,
  },
  parameters: [
    {
      name: "bucket",
      value: bucketName,
      description: "S3 bucket which contains outputs, intermediate results, and other project-specific data",
    },
    {
      name: "installed-artifacts/s3-root-url",
      value: `s3://${bucketName}/artifacts/batch-artifacts`,
      description: "S3 root url for batch assets",
    },
  ],
});
