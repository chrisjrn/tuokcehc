# tuokcehc
A Free Software tokenisation environment for Stripe based on `epirts.js`


# How does it work?
Like Stripe's proprietary JS programs, a client-side JavaScript file is embedded in your own web site. When `doCheckout()` is called, an iframe is created, which displays a form that accepts cardholder data, which is sent off to Stripe for tokenization.

Once tokenization is successful, the token is sent back to your web application, for you to handle.


# Deployment
This is a flask app that is designed to be deployed on a server in a PCI-compliant environment. In particular, the `form` endpoints and `iframe-support.js` code MUST be deployed in a PCI-compliant environment.

You must specify a JSON list of Stripe publishable keys as an environment variable; the flask app will reject any requests that use a publishable key that is not specified. e.g.

```
$ export VALID_PUBKEYS=["pubkey_1", "pubkey_2"]
$ flask run FLASK_APP=tuokcehc.py flask run
```


# Embedding the javascript
`tuokcehc.js` is designed to be embedded on your own web application, like Stripe's `checkout.js`. Your web application doesn't necessarily need to be PCI-compliant, unless it is handling credit card data.

You must call two js functions -- `setStripePublishableKey()` and `setStripeTokenCallback()`, as follows:

```
setStripePublishableKey("pubkey_1");
setStripeTokenCallback(function(token) { console.log(token); });
```

Finally, you must provide a link that calls `doCheckout()` when clicked -- this will pop up the iframe that will perform the tokenization.



# Licence
This application is licenced under Version 3 of the GNU General Public Licence, with the following exceptions:
* `client-demo.html`, a demo of how to embed the client-side JavaScript in your application, which has copyright waived under CC0.
* `tuokcehc.js`, the client-side JavaScript, which is licenced under Version 3 of the GNU Lesser General Public License. You may link the client-side JavaScript in your own non-GPL applications, however, if you distribute a modified version of the client-side JavaScript, you must release that modified version under the LGPL or GPL.


# PCI DSS Compliance
All merchants who accept payment cards must comply with the Payment Card
Industry Data Security Standards.  Merchants classified in Levels 2 through 4
may complete an annual Self-Assessment Questionnaire.

E-commerce merchants who "fully outsource" all cardholder data processing to a
PCI DSS compliant third-party payment processor (by redirecting to or loading in
an iframe a payment page served by the payment processor) can file SAQ A.  This
applies to merchants who use the non-free Stripe.js program, because it loads a
payment page from Stripe in an iframe.

E-commerce merchants who "partially outsource" their payment processing (e.g. by
serving their own payment page and sending cardholder data to a payment
processor by JSONP) must file the longer SAQ A-EP and have quarterly
vulnerability scans performed by an Approved Scanning Vendor.  This applies to
merchants who use Epirts.js, because it uses JSONP instead of an iframe, to
avoid causing the customer to run non-free JavaScript programs loaded by
Stripe's payment page.

Therefore, under PCI DSS 3.0, **Epirts.js may not be used to process live
payment cards without first completing PCI SAQ A-EP and having an ASV perform
quarterly vulnerability scans**.  Currently, the only way to control your
store's checkout process and ensure that no non-free JavaScript programs are
distributed to your customers is to use a program like Epirts.js (or process
cardholder data directly on your server) and pay for a scanning service.  Such
is the state of payment processing.
