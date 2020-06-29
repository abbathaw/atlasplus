import * as macroController from '../controllers/macroController';
import studioRouter from './studio';

export default function routes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.
    app.get('/', (req, res) => {
        res.redirect('/atlassian-connect.json');
    });

    app.get('/video-macro', addon.authenticate(), macroController.videoMacro);
    
    app.use('/video-studio', addon.authenticate(), studioRouter)
  
}
