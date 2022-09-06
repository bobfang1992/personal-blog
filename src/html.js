import React from "react"
import PropTypes from "prop-types"
export default function HTML(props) {
  let defaultTheme = "light"

  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
        <script defer data-domain="csgrinding.xyz" src="https://plausible.io/js/plausible.js"></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3584669266774682"
          crossorigin="anonymous"></script>
      </head>
      <body {...props.bodyAttributes} className={defaultTheme}>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-604T10SV5P"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-604T10SV5P');

          (function() {
            window.__onThemeChange = function() {};
            function setTheme(newTheme) {
              window.__theme = newTheme;
              preferredTheme = newTheme;
              document.body.className = newTheme;
              window.__onThemeChange(newTheme);
            }
            var preferredTheme;
            try {
              preferredTheme = localStorage.getItem('theme');
            } catch (err) { }
            window.__setPreferredTheme = function(newTheme) {
              setTheme(newTheme);
              try {
                localStorage.setItem('theme', newTheme);
              } catch (err) {}
            }
            var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkQuery.addListener(function(e) {
              window.__setPreferredTheme(e.matches ? 'dark' : 'light')
            });

            setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
          })();
          `,

          }}
        />
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=48&l=ur1&category=pcvideogames&banner=0ARHTTTPV6PH0V84N202&f=ifr&linkID={{link_id}}&t=csgrinding-21&tracking_id=csgrinding-21" width="728" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0" sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"></iframe>
      </body>

    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
