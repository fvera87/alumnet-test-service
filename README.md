# Base Manager Service

This service provides the basic dependencies and configuration to start creating a new service including linter, prettier, jest, env variables, deployment and local evironment/testing.

## Set up the new project

- Change root directory name.
- For consistency, remove git and initialize it again:
    - `rm -rf .git`
    - `git init`
    - `git remote add origin https://forfans@bitbucket.org/forfansllc/NEW_REMOTE.git`
- Modify readme file
- Change project name in package.json
- Set the service name in serverless.yml
- If the service is going to have a database:
    - Set env variable name for `DB_TABLE`
    - Configure the table resource (name, attributes, etc) in the serverless.yml
- Else:
    - Remove the plugin `serverless-dynamodb-local` from serverless.yml
    - Remove the dependency `serverless-dynamodb-local` from package.json
    - Remove the variable `DB_TABLE` from .env
    - Remove database directory
    - Remove Table resource from serverless.yml
    - Remove `Install Serverless dynamodb local` step from circleci worflow config
- If any lambda will be triggered by an http event:
    - Set correct value to env `BASE_PATH`
    - Remove isValidContentType.js helper if it's not necessary
- Else:
    - Remove `BASE_PATH` and `API_DOMAIN` env's
    - Remove `serverless-domain-manager` dependency from package.json
    - Remove from serverless.yml:
        - The plugin `serverless-domain-manager`
        - The entire object `customDomain` from `custom`
    - Remove responseHandler.js helper
    - Remove isValidContentType.js helper
- If the service is not using the authorizer service remove `AUTHORIZER_ARN` and `AUTHORIZER_KEY` from env
- Controllers:
    - Change `entity` directory name to the proper one
    - Set the proper name to `controller.js`
- CI/CD:
    - Change folder name in .circleci/config.yml `base-service` -> `NEW_SERVICE_NAME-service`
- Run `yarn`
- Commit changes with the message 'Initial commit'
- Enjoy coding

## Important

- When deploying to PRODUCTION, an `env.production` file must be created and filled with the variables in the directory `src/config/constants`
- When doing local testing, remove dynamodb directory before deploying

## Prerequisites

- Node

```
brew install node
```

- Yarn

```
brew install yarn
```

- Serverless

```
brew install serverless
```

- Config serverless credentials with **serverless-agent** user from AWS IAM

```
serverless config credentials --provider aws --key ACCESSKEYID --secret SECRETKEY
```

## Installing

install yarn dependencies

```
yarn
```

Instal DynamoDB locally

```
sls dynamodb install --localPath ./bin
```

## Running

Run application locally

```
yarn start
```

## Running tests

Set up local enviroment

```
yarn start
```

Run tests

```
yarn test
```

## Deploying

- Deploy to DEV enviroment

```
yarn deploy
```

- Deploy to STAGING enviroment

```
yarn deploy:staging
```

- Deploy to PRODUCTION enviroment

```
yarn deploy:production
```
