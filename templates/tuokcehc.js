/*
 * Tuokcehc.js
 * Free software replacement for Stripe Checkout based on epirts.js
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this file.
 *
 * Copyright (C) 2017  Christopher Neugebauer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g. minimized or compacted) forms of
 * this program without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 */

var TUOKCEHC_PAYMENT_FRAME_ID = "tuokcehc-payment-frame"


/** Set the Stripe publishable key.
@param newStripePublishableKey the publishable key
*/
function setStripePublishableKey(newStripePublishableKey) {
   tuokcehcStripePublishableKey = newStripePublishableKey;
}


/** Set the callback for the token once it is sent back by Stripe.

@param newCallback a function(token), which accepts `token`, a string containing
the Stripe API token for the user's card details.
*/
function setStripeTokenCallback(newCallback) {
 tuokcehcStripeCallback = newCallback;
}


/** Creates an iframe that points to the cardholder data form, which must be served
from a PCI-compliant environment
*/
function doCheckout() {

    /* Create background element */
    bgDiv = document.createElement("div");
    bgDiv.setAttribute("id", TUOKCEHC_PAYMENT_FRAME_ID);
    bgDiv.setAttribute(
        "style",
        "position: absolute; top: 0; left: 0; bottom: 0; right: 0; " +
        "background: rgba(0, 0, 0, 0.8); "
    );
    document.body.appendChild(bgDiv);

    /* Create containing div for iframe */
    containingDiv = document.createElement("div");
    containingDiv.setAttribute(
        "style",
        "width: 90%; max-width: 800px; height: 90%; max-height: 600px;" +
        "margin: 20px auto;"
    );
    bgDiv.appendChild(containingDiv);

    /* Create iframe */
    FORM_IFRAME_NAME = "tuokcehc-iframe";
    iframe = document.createElement("iframe");
    iframe.setAttribute("name", FORM_IFRAME_NAME);
    iframe.setAttribute(
        "style",
        "width: 100%; height: 100%; border: 0;"
    );
    containingDiv.appendChild(iframe);

    /* Create a big "x" button in the top-right */
    closeyLink = document.createElement("a");
    closeyLink.setAttribute(
        "style",
        "font-size: xx-large; font-family: sans-serif; color: white;" +
        "position: absolute; top: 10px; right: 20px; "
    );
    closeyLink.addEventListener("click", closePaymentFrame);
    closeyText = document.createTextNode("×");
    closeyLink.appendChild(closeyText);
    bgDiv.appendChild(closeyLink);

    /* Create a form to post data into the iframe */
    form = document.createElement("form");
    form.setAttribute("action", "{{ request.url_root }}form");
    form.setAttribute("target", FORM_IFRAME_NAME);
    form.setAttribute("method", "POST");
    form.setAttribute("hidden", true);

    pubkeyInput = document.createElement("input");
    pubkeyInput.setAttribute("name", "pubkey");
    pubkeyInput.setAttribute("type", "hidden");
    pubkeyInput.setAttribute("value", tuokcehcStripePublishableKey);
    form.appendChild(pubkeyInput);

    bgDiv.appendChild(form);
    form.submit();

}

function closePaymentFrame() {
    element = document.getElementById(TUOKCEHC_PAYMENT_FRAME_ID);
    document.body.removeChild(element);
}

function receiveTuokcehcMessage(message) {
    data = message.data;
    token = data.token;

    if (event.origin != "{{ request.scheme }}://{{ request.host }}") {
        return;
    }

    tuokcehcStripeCallback(token);
    closePaymentFrame();
}


window.addEventListener("message", receiveTuokcehcMessage, false);

var tuokcehcStripeCallback = function(token) {
    console.log("Replace this callback by calling setStripeTokenCallback()");
    console.log(token);
}
var tuokcehcStripePublishableKey = "";
