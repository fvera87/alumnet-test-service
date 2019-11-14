
# Backend Test description

The worldwide known feria de sevilla is coming (well, not really) and we made the mistake of asking one of our british developers who only knows about rebuhíto from his yearly summer trips to malaga to help us in our new social "caseta" serving some drinks. To help mitigate the problem... create a micro-service able to accept RESTful requests receiving as parameters an ingredient, it returns a cocktail, if exists in the api.

## Business rules
* If the cocktails exist with such ingredient, return the list.
* If the cocktail does not exists, return an empty list with one extra field, suggesting a similar ingredient.

## Hints
You can use https://rapidapi.com/theapiguy/api/the-cocktail-db `Search By ingredient` to fetch the cocktail by ingredients. You can also use `List the ingredients` endpoint to discover every ingredients existent, if needed.

## Non functional requirements
As this service will be a worldwide success, it must be prepared to be fault tolerant, responsive and resilient.
Use whatever language, tools and frameworks you feel comfortable to, and briefly elaborate on your solution, architecture details, choice of patterns and frameworks.
Also, make it easy to deploy/run your service(s) locally (consider using some container/vm solution for this).

# Backend Test solution

## Prerequisites

- Node

```
brew install node
```

- Yarn

```
brew install yarn
```

## Installing

install yarn dependencies

```
yarn
```

Instal DynamoDB locally

```
sls dynamodb install
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

## Solution description

I decided to use the serverless framework as it seemed the easiest solution to me and what makes more sense as it is what is going to be used in the project, but it could easily be changed to an express/hapi app. Just the controllers would need to be adapted to take the information from the request object and not from the handler event, but the services, repositories, helpers, etc would still be perfectly valid.

I implemented a solution based in 2 lambdas. The first one as I said would be the pre-fetch function, which would fetch the cocktails and ingredients information and store it in DynamoDB. I decided to run this function in a range of 2 weeks (easily configurable through a variable). The information seems pretty stable so we don't need to hit the API that often, but it wouldn't hurt to check once in a while for possible updates and update the information. In case there's a problem with it the information should not be updated.

The second lambda would be a get function. It will be trigger by APIGateway under '/cocktails' to follow RESTFull standards regarding paths. The filter (ingredient in this case) will be passed as a queryStringParameter. This function will try to hit the DB to get the information, but in case it fails it also has a fallback to fetch the information directly from the API.

I also tested a huge part of the application using jest. I did some integration tests in the controllers to check that the whole application communicates correctly, and each component independently through unit tests as well, mocking their dependencies.

To run the project it is enough to follow the instructions provided above. 

For deployments, we just have to configure the AWS credentials in the machine we want to use this, and run sls deploy, setting the proper stage with the flag --stage (2 .env files have been provided for dev and staging, another one for prod should be set but even though this is not really important it is not a good practice to keep those in a public repository)

Regarding VM/Container, due to the nature of serverless, it is not needed. Using the command mentioned above, the local webserver will be initialized alongside the dynamodb server with the table initialized as well. However, I prepared a little dockerfile and a docker-compose just to show that if the project also needs it, it should not be a problem (up to certain point, I'm not a DevOps :-)) 

Thanks for the opportunity and the time invested on reviewing my solution.
