# [1.18.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.17.0...v1.18.0) (2024-05-15)

### Features

-   **sls:** added log deletion policy ([#306](https://github.com/Pulsifi/talent-acquisition-fn/issues/306)) ([61d61fe](https://github.com/Pulsifi/talent-acquisition-fn/commit/61d61fe2a42b34c5bba4bf8627cd0a187ef1b008))

# [1.17.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.16.1...v1.17.0) (2024-04-26)

### Features

-   **role-fit:** weightage & role fit breakdown distribution ([#305](https://github.com/Pulsifi/talent-acquisition-fn/issues/305)) ([dbe7539](https://github.com/Pulsifi/talent-acquisition-fn/commit/dbe7539ef5ea6b147faf6b0188473e5173db208a))

## [1.16.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.16.0...v1.16.1) (2024-04-16)

### Bug Fixes

-   **timeline:** capture assessment completed action history only if job have assessment ([#304](https://github.com/Pulsifi/talent-acquisition-fn/issues/304)) ([d33750a](https://github.com/Pulsifi/talent-acquisition-fn/commit/d33750a65eec1452157418727379787126b02f09))

# [1.16.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.15.1...v1.16.0) (2024-04-04)

### Features

-   remove obsoleted code from old fit score flow ([#301](https://github.com/Pulsifi/talent-acquisition-fn/issues/301)) ([24707e5](https://github.com/Pulsifi/talent-acquisition-fn/commit/24707e52d26ded241442df70c72101860d68b777))

## [1.15.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.15.0...v1.15.1) (2024-04-01)

### Bug Fixes

-   **distribution-score:** do not throw error when score given is higher than max score ([#300](https://github.com/Pulsifi/talent-acquisition-fn/issues/300)) ([ecaf5ba](https://github.com/Pulsifi/talent-acquisition-fn/commit/ecaf5ba2e15073f02bfffa58f67b62781c1eea5c))

# [1.15.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.14.0...v1.15.0) (2024-03-21)

### Features

-   **compute:** fit scores ([#298](https://github.com/Pulsifi/talent-acquisition-fn/issues/298)) ([33a65fa](https://github.com/Pulsifi/talent-acquisition-fn/commit/33a65fa304907ae040c136150424e611b2eeb4da))

# [1.14.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.13.2...v1.14.0) (2024-03-05)

### Features

-   **package:** upgrade fn-lib ([#297](https://github.com/Pulsifi/talent-acquisition-fn/issues/297)) ([4908e35](https://github.com/Pulsifi/talent-acquisition-fn/commit/4908e357f5e52eabdbbcdd3014fbc8474c0b711a))

## [1.13.2](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.13.1...v1.13.2) (2024-03-01)

### Bug Fixes

-   **github-workflow:** added missing character ([#296](https://github.com/Pulsifi/talent-acquisition-fn/issues/296)) ([aaa2d42](https://github.com/Pulsifi/talent-acquisition-fn/commit/aaa2d42aa9e82a4865a3ebe8082bccf26f085038))
-   **job-application-score:** pairwise score ([#295](https://github.com/Pulsifi/talent-acquisition-fn/issues/295)) ([08738c4](https://github.com/Pulsifi/talent-acquisition-fn/commit/08738c4b673f898a628f1640254508f6a03644be))

## [1.13.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.13.0...v1.13.1) (2024-02-23)

### Bug Fixes

-   **job-application-score:** missing some logic for phase1 fit score handling ([#293](https://github.com/Pulsifi/talent-acquisition-fn/issues/293)) ([a38bbfb](https://github.com/Pulsifi/talent-acquisition-fn/commit/a38bbfbe98fe8391fa3fd38f7153bedcffd67729))

# [1.13.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.12.2...v1.13.0) (2024-02-22)

### Features

-   **job-application-score:** added phase 1 fit score computation ([#290](https://github.com/Pulsifi/talent-acquisition-fn/issues/290)) ([2d7a8e7](https://github.com/Pulsifi/talent-acquisition-fn/commit/2d7a8e74967b60d0e14a9e035a2c3abc2b5d35f4)), closes [#291](https://github.com/Pulsifi/talent-acquisition-fn/issues/291)

## [1.12.2](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.12.1...v1.12.2) (2024-01-19)

### Bug Fixes

-   **jobapplication:** set assessment started at when completed count > 0 ([#289](https://github.com/Pulsifi/talent-acquisition-fn/issues/289)) ([ae9cb28](https://github.com/Pulsifi/talent-acquisition-fn/commit/ae9cb280cc5d0712d45a35a9916181487b4eade1))

## [1.12.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.12.0...v1.12.1) (2023-11-23)

### Bug Fixes

-   **mapper:** remove candidate career and education from mapped object ([#287](https://github.com/Pulsifi/talent-acquisition-fn/issues/287)) ([f8fe069](https://github.com/Pulsifi/talent-acquisition-fn/commit/f8fe069364d2ab082d7d8e8104ac19ac5a631b0c))

# [1.12.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.11.2...v1.12.0) (2023-10-18)

### Features

-   **job_application:** accept new candidate input fields ([#286](https://github.com/Pulsifi/talent-acquisition-fn/issues/286)) ([816f51b](https://github.com/Pulsifi/talent-acquisition-fn/commit/816f51b0a137fafe6bd5131429cf201e76ab46a2))

## [1.11.2](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.11.1...v1.11.2) (2023-09-26)

### Bug Fixes

-   add new condition where if no daxtra found return empty array ([#285](https://github.com/Pulsifi/talent-acquisition-fn/issues/285)) ([145f0c7](https://github.com/Pulsifi/talent-acquisition-fn/commit/145f0c72718dc251c9aad2801fce4d0334c20cb2))

## [1.11.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.11.0...v1.11.1) (2023-09-25)

### Bug Fixes

-   add new condition where if no daxtra found return empty array ([#284](https://github.com/Pulsifi/talent-acquisition-fn/issues/284)) ([1cf65c9](https://github.com/Pulsifi/talent-acquisition-fn/commit/1cf65c985b28f2bbb3a0fb85cea1cadf158e3ff6))

# [1.11.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.10.1...v1.11.0) (2023-09-22)

### Features

-   **job-application:** resume skill extraction ([#283](https://github.com/Pulsifi/talent-acquisition-fn/issues/283)) ([95cf957](https://github.com/Pulsifi/talent-acquisition-fn/commit/95cf957ac4ef4eac359bdd574035e1fb51cae4c8))

## [1.10.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.10.0...v1.10.1) (2023-08-04)

### Bug Fixes

-   **application-timeline-enum:** update APPLICATION_IMPORTED_AS_EMPLOYEE to use snake case ([#282](https://github.com/Pulsifi/talent-acquisition-fn/issues/282)) ([87b5206](https://github.com/Pulsifi/talent-acquisition-fn/commit/87b520693a200e007b30daba605486b292c84a9d))

# [1.10.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.9.0...v1.10.0) (2023-07-26)

### Features

-   **job-application:** handle imported employee event ([#281](https://github.com/Pulsifi/talent-acquisition-fn/issues/281)) ([c4148ec](https://github.com/Pulsifi/talent-acquisition-fn/commit/c4148ecfca71c8b92bc3fb1d36f0891a91f33934))

# [1.9.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.8.2...v1.9.0) (2023-07-21)

### Features

-   **publisher:** add job application id as message group id to ensure FIFO ([#279](https://github.com/Pulsifi/talent-acquisition-fn/issues/279)) ([5e41957](https://github.com/Pulsifi/talent-acquisition-fn/commit/5e4195774bcce8f8893eb36c39db1b42d4090eca))

## [1.8.2](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.8.1...v1.8.2) (2023-06-22)

### Bug Fixes

-   **assessment:** duplicated assessment ([#277](https://github.com/Pulsifi/talent-acquisition-fn/issues/277)) ([5ef9fd3](https://github.com/Pulsifi/talent-acquisition-fn/commit/5ef9fd330af9af8c550c256c8c98770f409c5729))

## [1.8.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.8.0...v1.8.1) (2023-06-01)

### Bug Fixes

-   **assessment:** skip video assessment when mark assessment started at ([#276](https://github.com/Pulsifi/talent-acquisition-fn/issues/276)) ([b9c4dc0](https://github.com/Pulsifi/talent-acquisition-fn/commit/b9c4dc0e88fbbc86c3a253a3dad7b7aa34f94c6b))

# [1.8.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.7.0...v1.8.0) (2023-05-24)

### Features

-   **assessment:** save assessment started at ([#275](https://github.com/Pulsifi/talent-acquisition-fn/issues/275)) ([d59a29a](https://github.com/Pulsifi/talent-acquisition-fn/commit/d59a29ada2ef6521814aadbbed1f11e3cd8ae237))

# [1.7.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.6.0...v1.7.0) (2023-04-17)

### Features

-   **screening:** update application with screening answer ([#273](https://github.com/Pulsifi/talent-acquisition-fn/issues/273)) ([ddd64b1](https://github.com/Pulsifi/talent-acquisition-fn/commit/ddd64b1c39695f6dbbc99e4ceddb2b5e61415911))

# [1.6.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.5.0...v1.6.0) (2023-04-07)

### Features

-   **serverless:** upgrade serverless with npm/node upgrade ([#272](https://github.com/Pulsifi/talent-acquisition-fn/issues/272)) ([be302f8](https://github.com/Pulsifi/talent-acquisition-fn/commit/be302f83e20a36281207c085f942c65921275978))

# [1.5.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.4.1...v1.5.0) (2023-03-31)

### Features

-   **primaryemail:** save primary_contact_email ([#271](https://github.com/Pulsifi/talent-acquisition-fn/issues/271)) ([2f35cfa](https://github.com/Pulsifi/talent-acquisition-fn/commit/2f35cfa61892a69a469e6f5a0b02651a4aa29a14))

## [1.4.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.4.0...v1.4.1) (2023-02-14)

### Bug Fixes

-   **ci:** refactor gh action workflows ([#269](https://github.com/Pulsifi/talent-acquisition-fn/issues/269)) ([63bbb0e](https://github.com/Pulsifi/talent-acquisition-fn/commit/63bbb0ed6e0537e89cdb95b9fdeaa98b5892e9f6))

# [1.4.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.3.0...v1.4.0) (2023-01-30)

### Features

-   **sentry:** add aws_region sentry tag ([#265](https://github.com/Pulsifi/talent-acquisition-fn/issues/265)) ([75a9765](https://github.com/Pulsifi/talent-acquisition-fn/commit/75a976588d962a83003922e411ffe9d349d2a208))

# [1.3.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.2.3...v1.3.0) (2022-12-09)

### Features

-   dependabot patch ([#262](https://github.com/Pulsifi/talent-acquisition-fn/issues/262)) ([7362aa9](https://github.com/Pulsifi/talent-acquisition-fn/commit/7362aa9c7dcec1a3a8724d0dcacfbd17fef7bcef))

## [1.2.3](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.2.2...v1.2.3) (2022-10-26)

### Bug Fixes

-   **handler:** add new handler and database model entities ([#259](https://github.com/Pulsifi/talent-acquisition-fn/issues/259)) ([2409761](https://github.com/Pulsifi/talent-acquisition-fn/commit/2409761459983b731b95b9aefed2476b54d2c47a))

## [1.2.2](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.2.1...v1.2.2) (2022-08-05)

### Bug Fixes

-   **rolefitscore:** set careers as empty array ([#258](https://github.com/Pulsifi/talent-acquisition-fn/issues/258)) ([2ce3233](https://github.com/Pulsifi/talent-acquisition-fn/commit/2ce3233a32ab702213a4321b210532c6bddb7a5b))

## [1.2.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.2.0...v1.2.1) (2022-07-08)

### Bug Fixes

-   **job-app:** add question_hash_code in job app screening answer ([#256](https://github.com/Pulsifi/talent-acquisition-fn/issues/256)) ([0483255](https://github.com/Pulsifi/talent-acquisition-fn/commit/04832551710820ea04d048d42cf09d5acebde9c4))

# [1.2.0](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.1.2...v1.2.0) (2022-06-24)

### Bug Fixes

-   add aws assumed role ([e02f804](https://github.com/Pulsifi/talent-acquisition-fn/commit/e02f80406bb893cdc9a65efb27c946df0b5cf288))
-   remove unwanted branch trigger rule ([52ae86e](https://github.com/Pulsifi/talent-acquisition-fn/commit/52ae86e252259b54f8cd43810ada87763ddda402))
-   **submit-app:** if job app already submitted, retry send event ([#255](https://github.com/Pulsifi/talent-acquisition-fn/issues/255)) ([66735fe](https://github.com/Pulsifi/talent-acquisition-fn/commit/66735fe11c58ade9790bbd8e69491b96ead39e23))
-   update subnetIds ssm ([c1f7002](https://github.com/Pulsifi/talent-acquisition-fn/commit/c1f7002bbc47a61c3cdf3c734611321cfeca4196))

### Features

-   refactor and add gh action cicd workflows ([#254](https://github.com/Pulsifi/talent-acquisition-fn/issues/254)) ([641043e](https://github.com/Pulsifi/talent-acquisition-fn/commit/641043ed5adfeb86ac54444c8aca0cf76f57ed58))

## [1.1.2](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.1.1...v1.1.2) (2022-06-07)

### Bug Fixes

-   add github semantic-release ([7573899](https://github.com/Pulsifi/talent-acquisition-fn/commit/757389915ca5238110bf88765a01d390eb9e9c5b))

## [1.1.1](https://github.com/Pulsifi/talent-acquisition-fn/compare/v1.1.0...v1.1.1) (2022-06-07)

### Bug Fixes

-   **sentry:** resolve http 429 ([#251](https://github.com/Pulsifi/talent-acquisition-fn/issues/251)) ([a616591](https://github.com/Pulsifi/talent-acquisition-fn/commit/a616591760e0d5f8dd29c7333a4d5f5261f95bf0))
