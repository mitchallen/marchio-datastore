## Marchio Child App Example

### Google Datastore Demo

Demo of using __marchio-datastore__ as a child app of __marchio__.


  
* * *

## Usage

```
$ npm init
$ npm install marchio --save
```

#### Prerequisite

To run the Google Datastore demo you will need a Google Cloud account.  Visit https://cloud.google.com for more info.

* * *

#### Environment Variables

Create an environment variable set to the value of a Google Cloud project id and another set to an HTTP port value:

```
$ export MARCHIO_GOOGLE_PROJECT_ID='my-project-id'
$ export MARCHIO_PORT=8080
```

You can make this permanent by setting it in <b>~/.bash\_profile</b> on a Mac or in Linux and then running <b>source ~/.bash_profile</b>.

The Google Cloud project must be enabled for Google Datastore.

* * *

#### Install the Dependencies

At the command line execute the following (sans $):

```
$ npm install
```
    


At the command line run:

```
$ node index.js
```
   
##### HTTP POST
 
In a second terminal window run this command:

```
$ curl -i -X POST -H "Content-Type: application/json" -d '{"email":"test@demo.com"}' http://localhost:8080/user
```

The response will look like this (but with a different _id number):

```
{"email":"test@demo.com","status":"NEW","_id":"1234567890123456"}
```

##### HTTP GET

Copy the <b>_id</b> number and paste it into a command like this (replacing <i>1234567890123456</i> with whatever was returned by the POST command):

```
$ curl -X GET -H "Accept: applications/json" http://localhost:8080/user/1234567890123456
```

In a browser visit https://console.cloud.google.com/datastore/ and verify that the entity has been added.

##### HTTP PUT

Paste the id into another command like this (replacing 1234567890123456 with whatever was returned by the POST command):

```
$ curl -i -X PUT -H "Content-Type: application/json" -d '{"email":"test@demo.com", "status":"UPDATED"}' http://localhost:8080/user/1234567890123456
```
    
Run the GET command again to see the change to the status value.

In a browser visit https://console.cloud.google.com/datastore/ and verify that the entity has been updated.

##### HTTP PATCH

__PATCH__ is similar to __PUT__. You still need to include the id of the record in the URL. But the data you pass in is not a set of fields. Instead it's a set of instructions for how to patch the record. To patch a record it first has to retrieve it, patch it, then save it, requiring two trips to the database. 

```
curl -i -X PATCH -H "Content-Type: application/json" -d '[{"op":"replace","path":"/status","value":"PATCH THE STATUS"}]' http://localhost:8080/user/1234567890123456
```

Behind the scenes the the code uses __fast-json-patch__. Search for that on npm for more info how to apply patches.


##### HTTP DELETE

To delete the entity run another command like this (pasting over the id with the one returned by the POST command):

```
$ curl -i -X DELETE -H "Content-Type: application/json" http://localhost:8080/user/1234567890123456
```

Now run the GET command again and see the the entity was not found. 

Try the POST command a few more times, changing the email address value each time.