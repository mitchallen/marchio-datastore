## Google Cloud Function Example

This example shows how to use __marchio-datastore__ to update a database using Google Cloud Functions.

#### Important Note

At the time of this writing, Google Cloud Functions are in Beta.

#### Learn More

You can learn more about Google Cloud Functions on the official Web site:

https://cloud.google.com/functions

## Setup

Your Google Cloud project must be enabled for Google Cloud Functions and Google Datastore.

### Local Testing:

#### Environment Setup:

Substitute *myproject* for a valid Google Cloud Project ID. 

```
$ gcloud config set project myproject
$ export GCLOUD_PROJECT=myproject
```

To keep the __GCLOUD\_PROJECT__ setting you can also add it to __~/.bash_profile__ on Linux or a Mac.

#### Run Locally

```$ node index.js```

Open a second terminal tab and run:

```$ npm run test-local-post```

Note in the response the Location / id and integrate it into a curl GET command. For example, if the id were 1234567890123456:

```
$ curl -i -X GET -H "Accept: applications/json" \
  http://localhost:8080/betalist/1234567890123456
```

You can also review the Entities to see the new record here:

https://console.cloud.google.com/datastore/

#### Run in the Cloud

For details on how to deploy to the Google Cloud Function (GCF) platform, read the documentation.

When you are ready to deploy the command will look like something like this (substituting the variable values):

```
$ gcloud beta functions deploy $FUNCTION_NAME --project $GCLOUD_PROJECT --stage-bucket $MY_BUCKET --trigger-http
```
 
When you deploy to GCF it returns a URL in the response with this format:

```     
https://[REGION]-[GCLOUD_PROJECT].cloudfunctions.net/[FUNCTION_NAME]/
```

To use POST and GET you would take the URL returned and append the model name with a slash. 

For example, here is how you would POST with the following sets of values:

* REGION = us-central1
* GCLOUD_PROJECT = myproject
* FUNCTION_NAME = myfunc
* MODEL_NAME = betalist

``` 
$ curl -i -X POST -H \"Content-Type: application/json\" \
  -d '{\"email\":\"func@funky.com\"}' \
  https://us-central1-myproject.cloudfunctions.net/myfunc/betalist/
```

Take note of the location info in the response, for example:

```Location: /betalist/1234567890123456```

Integrate the location returned into a GET command:

```
$ curl -i -X GET -H "Content-Type: application/json" \ 
  https://us-central1-myproject.cloudfunctions.net/myfunc/betalist/1234567890123456
``` 
 




