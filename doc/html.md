Finding Comments in HTML Source Code Using Regular Expressions

Motivation

Many text editors have advanced find (and replace) features. I recently wrote an article about finding C style comments in source code. A similar technique can be used to find comments in HTML files.

The Start and End

HTML comments are just about as tricky to find as C style comments but their composition is different. Each comment starts with a <!. It is then followed by possible white space. That portion of the regular expression is: \<![ \r\n\t]*. Note that the less than sign that starts the comment must be escaped in most regular expression packages. The end of the comment is similarly easy, it is simply a greater than: \>
\<![ \r\n\t].*[ \r\n\t]*\>

The Middle

The middle is slightly more tricky, it does not accept just anything. In general it has one or more sections each of which start with two dashes and end with two dashes. These sections can be separated by white space. The middle might be written like this: (--.*--[ \r\n\t]*) and our whole regular expression:
\<![ \r\n\t]*(--.*--[ \r\n\t]*)\>

The Middle Revisited—Solution

As with C style comments, this does not accept all comments on the first try. In this case it does not accept comments with a dash in them:
<!-- comment-with dash -->
<!-- comment -->
The fix for this is pretty easy. We need to accept anything that is not a dash, or a single dash followed by something that is not a dash. \<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>

/\<![ \r\n\t]*(--([^\-]|[\r\n]|-(?!-\>))*--[ \r\n\t]*)\>/

This expression can be used similarly to the one that finds C comments.