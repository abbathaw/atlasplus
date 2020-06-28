export default function routes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.
    app.get('/', (req, res) => {
        res.redirect('/atlassian-connect.json');
    });

    // This is an example route used by "generalPages" module (see atlassian-connect.json).
    // Verify that the incoming request is authenticated with Atlassian Connect.
    app.get('/hello-world', addon.authenticate(), (req, res) => {
        // Rendering a template is easy; the render method takes two params:
        // name of template and a json object to pass the context in.
        res.render('hello-world', {
            title: 'Atlassian Connect'
            //issueId: req.query['issueId']
        });
    });

    // Add additional route handlers here...
    // Render the macro by returning html generated from the hello-world template.
    // The hello-world template is defined in /views/hello-world.hbs.
    app.get('/macro', addon.authenticate(), function (req, res) {
            res.render('hello-world-macro', {
                title: 'Atlassian Connect'
            });
        }
    );
    
    app.get('/list-customers', addon.authenticate(), function (req, res) {
            var spaceKey =  req.query['spaceKey']
            res.render('list-customers', {
                spaceKey: spaceKey
            });
        }
    );
    
    app.get('/add-new-customer', addon.authenticate(), function (req, res) {
        var spaceKey =  req.query['spaceKey']
        res.render('new-customer', {
            spaceKey: spaceKey
        });
    });
    
    app.get('/customCheck', function (req, res) {
        res.json({answer: 42})
    });
    
}
