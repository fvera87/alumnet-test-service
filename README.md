
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

## Solution description

TODO