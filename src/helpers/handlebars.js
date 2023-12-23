const exphbs = require("express-handlebars");
const { PARTIALS_DIR, LAYOUTS_DIR, VIEWS_DIR } = require("../config/constants");

exports.init = app => {
    app.engine(
        "html",
        exphbs.engine({
            partialsDir: PARTIALS_DIR,
            layoutsDir: LAYOUTS_DIR,
        })
    );
    app.set("view engine", "html");
    app.set("views", VIEWS_DIR);
};
