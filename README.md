# Atlas+ Video Studio

An Atlassian Connect App using Express.

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
