# QA Case Assignment

In this document I will explain how I will approach this problem and my methods in solving it.
I developed such a service in JavaScript and deployed it on my own server for sake of demo. 
You can also checkout the code on my github:
https://github.com/maminio/qa-assignment.git


Here I present two approaches, A self-hosting method and a fully AWS server less method.

# Self-hosted
## Services
To make this process easy and clear for both the backend and frontend developers we can break the project in to 4 different service: 
	1. API-Backend
	2. Client
	3. Database
	4. Redis Cache

### API-Backend
This service require to have 3 endpoints 
	1. GET  `/docs` 
	2. GET  `/docs/:id`
	3. POST  `/docs/create`
	

#### Workflow
Upon API create new doc to text action a user can upload via `docs/create` 
	1. This endpoint uploads the file to an `S3`  bucket(Later on this can be handles by a worker service).
	2. When the file is uploaded submit a session to `AWS Textract` service and we then respond to the client with `201` status code.
	3. Whenever the `Textract` responds, we update the database and the respective document status.
  4. The client can fetch the status of the doc by the `/docs/:id` endpoint and update the user. 

#### Improvements 
	1. Break down the API backend service into 2 service, a `Worker` service to process a `Textract`  request and an API service backend for Auth and fetching data.
	2. Create a caching policy on get  `/doc/:id` and call the endpoint from client on repeat to create a real-time scenario for the user.  (For cache you can use Redis and Express middlewares)
  3. Take it full real-time: create a websocket or `GraphQL` endpoint and update the user with `Subscription` api.


### Serverless 
	1. Create lambda to upload file to S3 while containing extra fields to create a `Doc` entity in DynamoDB
	2. Upon creating new `doc`, you can submit a request to `AWS Textract` and upload the results on  `S3`.
	3. A good approach would be to set a Pub/Sub (SNS) service on the Bucket and on change trigger an endpoint to update the `doc` status in database. 
		1. Each Doc can have: IN_PROGRESS, DONE, SUBMITTED
	4. You can also host your frontend application on S3


- - - -

## Obstacles and complications 
	1. File size and type validation 
	2. Wrong results and validation of the results 
	3. Confidential documents and security 
	4. Files must be encrypted upon uploading to S3
	5. There must be a pipeline to decrypt file and then pass to Textract
  6. The data from Textract needs to be clean and represented in a clear format to the user.
	

## Comparison 
AWS Textract and services similar to it like the ones provided by GCP or Azure are more reliable in terms of security, scalability and precision. As in using OCR service, they require large testing on different types of documents and I can not just select the best OCR application on the web. 
Based on your exact needs and type of data, this issue should be tackled. You can also take this one step further and build it in house, which can give an advantage in customising and configuring it to your exact needs.


# Dome
You can find the demo at: 
[Doc Management](https://qa.dev.mamin.io)
And the source code is available:
https://github.com/maminio/qa-assignment.git

* You can create an account 
* You can upload a document 
* It will automatically convert it into text using the `Textract` api
* It will then upload the result into s3 and updates the database respectively
* You can then download the JSON results for each document 
