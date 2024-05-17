# Talent Acquisition Lambda

-   sample lambda takes a SQS message, then reads RDS credentials from AWS secret manager, initialise TypeORM connection with it and loads data into the RDS

## Setup

-   check that SQS / SNS are configured properly in serverless.yml
-   check that an IAM role similar to 'talent-acquisition-lambda-role' is assigned

```bash
TAG_VERSION=local-$(date -u +%Y%m%d-%H%M%S) yarn sls deploy --stage <environment> --region <region>
```

## AWS VPC setup

-   lambda: must have VPC and subnets similar to RDS assigned
-   lambda: create a security group 'aws-lambda-sqs-to-rds-sg', allow inbound by RDS security group
-   RDS security group: allow inbound by 'aws-lambda-sqs-to-rds-sg'

## Local testing

```bash
success:

RDS -> sls invoke local --stage sandbox --function receiver --path tests/samples/candidate_application_submitted.json
SNS -> sls invoke local --stage sandbox --awsAccountId xxxxxxx --function handler --path tests/sample-sqs-to-sns.json

failure:

sls invoke local --stage sandbox --awsAccountId xxxxxxx --function handler
```

-   For SNS testing, check that your message is generated in the SQS attached to the SNS.
