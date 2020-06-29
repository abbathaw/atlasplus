export default function routes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.
    app.get('/', (req, res) => {
        res.redirect('/atlassian-connect.json');
    });

    app.get('/video-macro', addon.authenticate(), function (req, res) {
            res.render('video-macro')
        }
    );
    
    app.get('/video-studio', addon.authenticate(), function (req, res) {
            var spaceKey =  req.query['spaceKey']
            res.render('video-studio', {
                spaceKey: spaceKey
            });
        }
    );
    
    app.get('/customCheck', addon.authenticate(), function (req, res) {
        console.log("request", req)
        res.json({answer: 42})
    });
    
}
