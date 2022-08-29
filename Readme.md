# This is NodeJS boilerplate project which based on:

 * express
 * typescript
 * mongoose
 * mailer
 * cron
 * jobs
 * webpack
 * yarn
 * jest
___


# Setup project

### Run mongodb and S3 with using docker-compose
```
docker-compose up -d
```

___
### Configure local s3 (optional)
You will have to configure `aws` with a dummy **Access Key** "accessKey1" and **Secret Access Key** "verySecretKey1". Leave everything else blank. See the following output as an example:

```
$ aws configure
AWS Access Key ID [****************Key1]: accessKey1
AWS Secret Access Key [****************Key1]: verySecretKey1
Default region name [None]:
Default output format [None]:
```

Create a bucket and verify it works (The IP in the following snippets should match your docker bridge):

```
$ aws s3api create-bucket --bucket example --endpoint-url http://localhost:8000
```

Add host to hosts file
```
127.0.0.1       localhost
```
___
### Create `.env` file configuration
For local env:
```
PORT=3000
APP_URL=http://localhost:3000

MONGODB_DSN=mongodb://localhost/example
MONGOOSE_DEBUG=false
AUTH_SECRET_TOKEN=72ef6d06f8450bd7b0bafb54c0cf918d604c20a4681ed08bca2091504223f96b

MAILER_SENDER=no-reply@example.com
MAILER_HOST=
MAILER_PORT=
MAILER_AUTH_USER=
MAILER_AUTH_PASSWORD=

AWS_S3_LOCAL_MODE=true
AWS_S3_BUCKET=example

STORAGE_PATH=./storage
```

For the production you should use real AWS s3 configurations:
```
AWS_KEY_ID=
AWS_KEY_SECRET=
AWS_S3_BUCKET=
AWS_S3_REGION=eu-central-1
```
