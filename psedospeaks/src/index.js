import React from "react";
import ReactDOMServer from "react-dom/server";
import Main from "@/app/page";  // Make sure Main component is correct

var src_default = {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Routing logic based on the pathname
        if (url.pathname === "/") {
            // Render the component to a string
            const html = ReactDOMServer.renderToString(<Main />);

            // Return the HTML as the response
            return new Response(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>PsedoSpeak</title>
          </head>
          <body>
            <div id="root">${html}</div>
          </body>
        </html>
      `, { status: 200, headers: { "Content-Type": "text/html" } });
        } else {
            return new Response("Page not found", { status: 404 });
        }
    }
};

export { src_default as default };
