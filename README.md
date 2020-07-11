# Atlas+ Video Studio

An Atlassian Connect App using Express.

###docker stuff

- build webpack `npm run build`
- build image
  `docker build . -t atlasplus`
- run image from docker-compose
  `docker-compose up`

  to deploy

  - with your aws profile`aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 527728718473.dkr.ecr.us-west-2.amazonaws.com`

- `docker tag atlasplus:latest 527728718473.dkr.ecr.us-west-2.amazonaws.com/atlasplus:latest`
- `docker push 527728718473.dkr.ecr.us-west-2.amazonaws.com/atlasplus:latest`
- create a new task..replace task in ecs service

## Start

- `npm install`
- update `credentials.json` file
  ```$xslt
  {
      "hosts": {
          <yourHost.atlassian.net>: {
              "product": "confluence",
              "username": <username>,
              "password": <apiPassword>
          }
      }
  }
  ```
- `docker-compose up -d`
- `npm run dev`

<div>Logo Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

#### AWS RESOURCES

- S3 bucket (atlasplus-video)
- SNS Topic (arn:aws:sns:us-west-2:527728718473:MediaConvertJobUpdates)
  - `https://atlasplus.ap.ngrok.io/snsTopic` subscribed
- Cloudwatch Event rule (arn:aws:events:us-west-2:527728718473:rule/MediaConvertUpdateRules)

```aidl
{
  "source": [
    "aws.mediaconvert"
  ],
  "detail-type": [
    "MediaConvert Job State Change"
  ],
  "detail": {
    "status": [
      "ERROR",
      "COMPLETE"
    ]
  }
}
```
