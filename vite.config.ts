import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [htmlMinify()],
  test: {
    environment: 'jsdom',
    globals: true, // This can help with 'beforeEach is not defined' if not already default
  },
});

const htmlComponentFile = /\.component\.html\?inline$/;

const minifyHTMLConfig = {
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
};

function htmlMinify() {
  return {
    name: 'html-minify',

    transform(src: string, id: string) {
      if (htmlComponentFile.test(id)) {
        return {
          code: `export default \`${customMinifyHtml(src, minifyHTMLConfig)}\``,
          map: null,
        };
      } else {
        return;
      }
    },
  };
}

function customMinifyHtml(htmlString: string, config?: any): string {
  let minifiedHtml = htmlString;

  // Remove HTML comments
  minifiedHtml = minifiedHtml.replace(/<!--[\s\S]*?-->/g, '');

  // Collapse Whitespace
  minifiedHtml = minifiedHtml.replace(/\s+/g, ' '); // Replace multiple whitespace with single space
  minifiedHtml = minifiedHtml.replace(/>\s+</g, '><'); // Remove newlines and spaces between tags
  minifiedHtml = minifiedHtml.trim(); // Trim leading/trailing whitespace

  // Remove Attribute Quotes (Simplified)
  minifiedHtml = minifiedHtml.replace(/(\w+)=["']([\w\d#-]+)["']/g, '$1=$2');

  // Remove Empty Attributes (Simplified for common attributes like class, id, style)
  minifiedHtml = minifiedHtml.replace(/\s*(class|id|style)=""/g, '');

  return minifiedHtml;
}
