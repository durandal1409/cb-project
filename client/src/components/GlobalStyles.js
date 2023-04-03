import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    --color-background: #F9F5EB;
	--color-background-dark: #E4DCCF;
    --color-headline: #00214d;
    --color-paragraph: #002B5B;
	--color-text: #342c1d;
    --color-button: #002B5B;
	--color-button-hover: #EA5455;
	--color-button-disable: #7f95ad;

    --font-heading: 'Poppins', sans-serif;
    --font-body: 'Roboto', sans-serif;

    --content-width: 950px;
    --big-block-width: 600px;
    --small-block-width: 300px;
  }

/* http://meyerweb.com/eric/tools/css/reset/ 
v2.0 | 20110126
License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}


h1, h2, h3, h4, h5, h6 {
	font-family: var(--font-heading);
	color: var(--color-headline);
}
body, p, div, a, button {
	font-family: var(--font-body);
	color: var(--color-paragraph);
}
h3 {
	font-size: 1.5rem;
	margin: 20px 0;
}
`;
